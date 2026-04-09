#!/bin/bash
# ConnektX AWS ECS + Fargate Setup (2 instances with auto-scaling)
set -e

echo "🚀 ConnektX AWS Infrastructure Setup"
echo "====================================="

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="connektx-web"
GEMINI_API_KEY="${GEMINI_API_KEY:-}"

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✓ AWS Account: $AWS_ACCOUNT_ID"
echo "✓ Region: $AWS_REGION"
echo ""

# Validate Gemini API Key
if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY not set"
  echo "   Run: export GEMINI_API_KEY=your_key_here"
  exit 1
fi

# 1. Create ECR Repository
echo "1/7 📦 ECR Repository..."
if aws ecr describe-repositories --repository-names $PROJECT_NAME --region $AWS_REGION >/dev/null 2>&1; then
  echo "    ✓ Already exists"
else
  aws ecr create-repository --repository-name $PROJECT_NAME --region $AWS_REGION --image-scanning-configuration scanOnPush=true >/dev/null
  echo "    ✓ Created"
fi
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$PROJECT_NAME"

# 2. Create Secrets Manager Secret
echo "2/7 🔐 Secrets Manager..."
if aws secretsmanager describe-secret --secret-id ${PROJECT_NAME}-secrets --region $AWS_REGION >/dev/null 2>&1; then
  aws secretsmanager update-secret --secret-id ${PROJECT_NAME}-secrets --secret-string "{\"GEMINI_API_KEY\":\"$GEMINI_API_KEY\"}" --region $AWS_REGION >/dev/null
  echo "    ✓ Updated"
else
  aws secretsmanager create-secret --name ${PROJECT_NAME}-secrets --secret-string "{\"GEMINI_API_KEY\":\"$GEMINI_API_KEY\"}" --region $AWS_REGION >/dev/null
  echo "    ✓ Created"
fi
SECRET_ARN=$(aws secretsmanager describe-secret --secret-id ${PROJECT_NAME}-secrets --query ARN --output text --region $AWS_REGION)

# 3. Create IAM Roles
echo "3/7 👤 IAM Roles..."
EXEC_ROLE_NAME="${PROJECT_NAME}-execution-role"
TASK_ROLE_NAME="${PROJECT_NAME}-task-role"

# Execution Role
if ! aws iam get-role --role-name $EXEC_ROLE_NAME >/dev/null 2>&1; then
  aws iam create-role --role-name $EXEC_ROLE_NAME --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
  aws iam attach-role-policy --role-name $EXEC_ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
  echo "    ✓ Execution role created"
else
  echo "    ✓ Execution role exists"
fi

# Task Role
if ! aws iam get-role --role-name $TASK_ROLE_NAME >/dev/null 2>&1; then
  aws iam create-role --role-name $TASK_ROLE_NAME --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
  aws iam put-role-policy --role-name $TASK_ROLE_NAME --policy-name SecretsManagerAccess --policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"secretsmanager:GetSecretValue\",\"secretsmanager:DescribeSecret\"],\"Resource\":\"$SECRET_ARN\"}]}"
  echo "    ✓ Task role created"
else
  echo "    ✓ Task role exists"
fi

EXEC_ROLE_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:role/$EXEC_ROLE_NAME"
TASK_ROLE_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:role/$TASK_ROLE_NAME"

# 4. Get VPC & Subnets
echo "4/7 🌐 VPC & Subnets..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region $AWS_REGION)
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[*].SubnetId" --output text --region $AWS_REGION)
SUBNET_ARRAY=($SUBNET_IDS)
echo "    ✓ VPC: $VPC_ID"
echo "    ✓ Subnets: ${SUBNET_ARRAY[0]}, ${SUBNET_ARRAY[1]}"

# 5. Create Security Groups
echo "5/7 🔒 Security Groups..."
ALB_SG_NAME="${PROJECT_NAME}-alb-sg"
TASK_SG_NAME="${PROJECT_NAME}-task-sg"

# ALB Security Group
ALB_SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$ALB_SG_NAME" "Name=vpc-id,Values=$VPC_ID" --query "SecurityGroups[0].GroupId" --output text --region $AWS_REGION 2>/dev/null)
if [ "$ALB_SG_ID" = "None" ] || [ -z "$ALB_SG_ID" ]; then
  ALB_SG_ID=$(aws ec2 create-security-group --group-name $ALB_SG_NAME --description "ALB for ConnektX" --vpc-id $VPC_ID --query "GroupId" --output text --region $AWS_REGION)
  aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $AWS_REGION
  aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $AWS_REGION
  echo "    ✓ ALB SG created"
else
  echo "    ✓ ALB SG exists"
fi

# Task Security Group
TASK_SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$TASK_SG_NAME" "Name=vpc-id,Values=$VPC_ID" --query "SecurityGroups[0].GroupId" --output text --region $AWS_REGION 2>/dev/null)
if [ "$TASK_SG_ID" = "None" ] || [ -z "$TASK_SG_ID" ]; then
  TASK_SG_ID=$(aws ec2 create-security-group --group-name $TASK_SG_NAME --description "ECS tasks for ConnektX" --vpc-id $VPC_ID --query "GroupId" --output text --region $AWS_REGION)
  aws ec2 authorize-security-group-ingress --group-id $TASK_SG_ID --protocol tcp --port 3000 --source-group $ALB_SG_ID --region $AWS_REGION
  echo "    ✓ Task SG created"
else
  echo "    ✓ Task SG exists"
fi

# 6. Create ALB & Target Group
echo "6/7 ⚖️  Load Balancer..."
ALB_NAME="${PROJECT_NAME}-alb"
TG_NAME="${PROJECT_NAME}-tg"

# ALB
ALB_ARN=$(aws elbv2 describe-load-balancers --names $ALB_NAME --query "LoadBalancers[0].LoadBalancerArn" --output text --region $AWS_REGION 2>/dev/null)
if [ "$ALB_ARN" = "None" ] || [ -z "$ALB_ARN" ]; then
  ALB_ARN=$(aws elbv2 create-load-balancer --name $ALB_NAME --subnets ${SUBNET_ARRAY[@]} --security-groups $ALB_SG_ID --scheme internet-facing --type application --query "LoadBalancers[0].LoadBalancerArn" --output text --region $AWS_REGION)
  echo "    ✓ ALB created"
else
  echo "    ✓ ALB exists"
fi
ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --query "LoadBalancers[0].DNSName" --output text --region $AWS_REGION)

# Target Group
TG_ARN=$(aws elbv2 describe-target-groups --names $TG_NAME --query "TargetGroups[0].TargetGroupArn" --output text --region $AWS_REGION 2>/dev/null)
if [ "$TG_ARN" = "None" ] || [ -z "$TG_ARN" ]; then
  TG_ARN=$(aws elbv2 create-target-group --name $TG_NAME --protocol HTTP --port 3000 --vpc-id $VPC_ID --target-type ip --health-check-path /api/health --health-check-interval-seconds 30 --query "TargetGroups[0].TargetGroupArn" --output text --region $AWS_REGION)
  echo "    ✓ Target group created"
else
  echo "    ✓ Target group exists"
fi

# Listener
LISTENER_ARN=$(aws elbv2 describe-listeners --load-balancer-arn $ALB_ARN --query "Listeners[0].ListenerArn" --output text --region $AWS_REGION 2>/dev/null)
if [ "$LISTENER_ARN" = "None" ] || [ -z "$LISTENER_ARN" ]; then
  aws elbv2 create-listener --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN --region $AWS_REGION >/dev/null
  echo "    ✓ Listener created"
else
  echo "    ✓ Listener exists"
fi

# 7. Create ECS Cluster & Service
echo "7/7 🚀 ECS Cluster & Service..."
CLUSTER_NAME="${PROJECT_NAME}-cluster"
SERVICE_NAME="${PROJECT_NAME}-service"
LOG_GROUP="/ecs/$PROJECT_NAME"

# Log Group
aws logs create-log-group --log-group-name $LOG_GROUP --region $AWS_REGION 2>/dev/null || echo "    ✓ Log group exists"

# ECS Cluster
if ! aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION --query "clusters[0].status" --output text 2>/dev/null | grep -q ACTIVE; then
  aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION >/dev/null
  echo "    ✓ Cluster created"
else
  echo "    ✓ Cluster exists"
fi

# Task Definition
TASK_DEF_JSON=$(cat <<EOF
{
  "family": "$PROJECT_NAME",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "taskRoleArn": "$TASK_ROLE_ARN",
  "executionRoleArn": "$EXEC_ROLE_ARN",
  "containerDefinitions": [{
    "name": "$PROJECT_NAME",
    "image": "$ECR_URI:latest",
    "portMappings": [{"containerPort": 3000}],
    "environment": [
      {"name": "AWS_SECRET_ARN", "value": "$SECRET_ARN"},
      {"name": "AWS_REGION", "value": "$AWS_REGION"},
      {"name": "NODE_ENV", "value": "production"}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "$LOG_GROUP",
        "awslogs-region": "$AWS_REGION",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "healthCheck": {
      "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})\""],
      "interval": 30,
      "timeout": 5,
      "retries": 3,
      "startPeriod": 60
    }
  }]
}
EOF
)

echo "$TASK_DEF_JSON" > /tmp/task-definition.json
aws ecs register-task-definition --cli-input-json file:///tmp/task-definition.json --region $AWS_REGION >/dev/null
echo "    ✓ Task definition registered"

# ECS Service
if ! aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION --query "services[0].status" --output text 2>/dev/null | grep -q ACTIVE; then
  aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --task-definition $PROJECT_NAME \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_ARRAY[0]},${SUBNET_ARRAY[1]}],securityGroups=[$TASK_SG_ID],assignPublicIp=ENABLED}" \
    --load-balancers "targetGroupArn=$TG_ARN,containerName=$PROJECT_NAME,containerPort=3000" \
    --health-check-grace-period-seconds 60 \
    --region $AWS_REGION >/dev/null
  echo "    ✓ Service created (2 tasks)"
else
  echo "    ✓ Service exists"
fi

# Auto-Scaling
echo "    ⚙️  Configuring auto-scaling..."
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/$CLUSTER_NAME/$SERVICE_NAME \
  --min-capacity 1 \
  --max-capacity 4 \
  --region $AWS_REGION 2>/dev/null || true

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/$CLUSTER_NAME/$SERVICE_NAME \
  --policy-name ${PROJECT_NAME}-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {"PredefinedMetricType": "ECSServiceAverageCPUUtilization"},
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 300
  }' \
  --region $AWS_REGION >/dev/null 2>&1 || true

echo "    ✓ Auto-scaling: 1-4 tasks (CPU target: 70%)"

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo "📍 Application URL: http://$ALB_DNS"
echo "📊 Service: $SERVICE_NAME (2 tasks, scales 1-4)"
echo "💰 Cost: ~\$25/month"
echo ""
echo "Next steps:"
echo "1. Push Docker image to ECR (see README.md)"
echo "2. Add GitHub secrets for auto-deployment"
echo "3. Push to 'prod' branch to deploy"
