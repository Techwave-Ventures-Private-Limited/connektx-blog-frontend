#!/bin/bash
# Monitor ALB health, target status, and HTTPS configuration
# Provides real-time status of your deployment

set -e

echo "📊 ALB Monitoring Dashboard"
echo "==========================="
echo ""

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
PROJECT_NAME="connektx-web"
REFRESH_INTERVAL="${REFRESH_INTERVAL:-30}"

ALB_NAME="${PROJECT_NAME}-alb"
TG_NAME="${PROJECT_NAME}-tg"
SERVICE_NAME="${PROJECT_NAME}-service"
CLUSTER_NAME="${PROJECT_NAME}-cluster"

# Function to clear screen (cross-platform)
clear_screen() {
  clear || printf '\033[2J\033[3J\033[1;1H'
}

# Function to display status
display_status() {
  clear_screen

  echo "📊 ConnektX ALB Status - $(date '+%Y-%m-%d %H:%M:%S')"
  echo "=================================================="
  echo ""

  # 1. ALB Status
  echo "1. 🔗 Load Balancer Status"
  echo "   ---"

  ALB_INFO=$(aws elbv2 describe-load-balancers \
    --names $ALB_NAME \
    --region $AWS_REGION \
    --query "LoadBalancers[0].[State.Code,DNSName,Scheme]" \
    --output text 2>/dev/null)

  ALB_STATE=$(echo $ALB_INFO | awk '{print $1}')
  ALB_DNS=$(echo $ALB_INFO | awk '{print $2}')
  ALB_SCHEME=$(echo $ALB_INFO | awk '{print $3}')

  if [ -z "$ALB_STATE" ]; then
    echo "   ❌ ALB not found"
  else
    if [ "$ALB_STATE" = "active" ]; then
      echo "   ✓ Status: $ALB_STATE"
    else
      echo "   ⚠️  Status: $ALB_STATE"
    fi
    echo "   DNS: $ALB_DNS"
    echo "   Scheme: $ALB_SCHEME"
  fi

  echo ""

  # 2. Listener Status
  echo "2. 🔌 Listeners"
  echo "   ---"

  ALB_ARN=$(aws elbv2 describe-load-balancers \
    --names $ALB_NAME \
    --region $AWS_REGION \
    --query "LoadBalancers[0].LoadBalancerArn" \
    --output text 2>/dev/null)

  LISTENERS=$(aws elbv2 describe-listeners \
    --load-balancer-arn $ALB_ARN \
    --region $AWS_REGION \
    --query "Listeners[].[Port,Protocol,ListenerArn]" \
    --output text 2>/dev/null)

  echo "$LISTENERS" | while read -r port protocol arn; do
    if [ -n "$port" ]; then
      echo "   Port $port: $protocol"
    fi
  done

  echo ""

  # 3. Target Group Status
  echo "3. 🎯 Target Group Status"
  echo "   ---"

  TG_ARN=$(aws elbv2 describe-target-groups \
    --names $TG_NAME \
    --region $AWS_REGION \
    --query "TargetGroups[0].TargetGroupArn" \
    --output text 2>/dev/null)

  if [ -n "$TG_ARN" ] && [ "$TG_ARN" != "None" ]; then
    TG_HEALTH=$(aws elbv2 describe-target-health \
      --target-group-arn $TG_ARN \
      --region $AWS_REGION \
      --query "TargetHealthDescriptions[].[Target.Id,TargetHealth.State,TargetHealth.Description]" \
      --output text 2>/dev/null)

    if [ -z "$TG_HEALTH" ]; then
      echo "   No targets registered"
    else
      HEALTHY_COUNT=0
      UNHEALTHY_COUNT=0
      TOTAL_COUNT=0

      echo "$TG_HEALTH" | while read -r target_id state description; do
        if [ -n "$target_id" ]; then
          TOTAL_COUNT=$((TOTAL_COUNT + 1))
          if [ "$state" = "healthy" ]; then
            echo "   ✓ $target_id: $state"
            HEALTHY_COUNT=$((HEALTHY_COUNT + 1))
          else
            echo "   ⚠️  $target_id: $state ($description)"
            UNHunhealthy_COUNT=$((UNHEALTHY_COUNT + 1))
          fi
        fi
      done

      # Count summary
      HEALTHY_COUNT=$(echo "$TG_HEALTH" | grep -c "healthy" || true)
      UNHEALTHY_COUNT=$(echo "$TG_HEALTH" | grep -c -v "healthy" | grep -c "." || true)
      TOTAL_COUNT=$(echo "$TG_HEALTH" | grep -c "." || true)

      echo "   Summary: $HEALTHY_COUNT healthy, $UNHEALTHY_COUNT unhealthy, $TOTAL_COUNT total"
    fi
  fi

  echo ""

  # 4. ECS Service Status
  echo "4. 🚀 ECS Service Status"
  echo "   ---"

  SERVICE_INFO=$(aws ecs describe-services \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $AWS_REGION \
    --query "services[0].[RunningCount,DesiredCount,Status]" \
    --output text 2>/dev/null)

  if [ -z "$SERVICE_INFO" ]; then
    echo "   ❌ Service not found"
  else
    RUNNING=$(echo $SERVICE_INFO | awk '{print $1}')
    DESIRED=$(echo $SERVICE_INFO | awk '{print $2}')
    STATUS=$(echo $SERVICE_INFO | awk '{print $3}')

    echo "   Status: $STATUS"
    echo "   Running: $RUNNING / Desired: $DESIRED"

    if [ "$RUNNING" = "$DESIRED" ] && [ "$STATUS" = "ACTIVE" ]; then
      echo "   ✓ All tasks running"
    else
      echo "   ⚠️  Tasks may be deploying or there's an issue"
    fi
  fi

  echo ""

  # 5. HTTPS Certificate Status
  echo "5. 🔐 HTTPS Certificate Status"
  echo "   ---"

  HTTPS_LISTENER=$(aws elbv2 describe-listeners \
    --load-balancer-arn $ALB_ARN \
    --region $AWS_REGION \
    --query "Listeners[?Port==\`443\`]" \
    --output json 2>/dev/null)

  if [ "$(echo $HTTPS_LISTENER | jq 'length')" -gt 0 ]; then
    CERT_ARN=$(echo $HTTPS_LISTENER | jq -r '.[0].Certificates[0].CertificateArn // "None"')

    if [ "$CERT_ARN" != "None" ] && [ -n "$CERT_ARN" ]; then
      echo "   ✓ HTTPS enabled"
      echo "   Certificate: $CERT_ARN"

      CERT_STATUS=$(aws acm describe-certificate \
        --certificate-arn $CERT_ARN \
        --region $AWS_REGION \
        --query "Certificate.[DomainName,Status,NotAfter]" \
        --output text 2>/dev/null)

      CERT_DOMAIN=$(echo $CERT_STATUS | awk '{print $1}')
      CERT_STATE=$(echo $CERT_STATUS | awk '{print $2}')
      CERT_EXPIRY=$(echo $CERT_STATUS | awk '{print $3}')

      echo "   Domain: $CERT_DOMAIN"
      echo "   Certificate Status: $CERT_STATE"
      echo "   Expires: $CERT_EXPIRY"
    else
      echo "   ⚠️  HTTPS listener exists but no certificate configured"
    fi
  else
    echo "   ℹ️  HTTPS not configured yet"
    echo "   Run: bash scripts/configure-alb-https.sh"
  fi

  echo ""

  # 6. Recent logs
  echo "6. 📋 Recent Errors (CloudWatch)"
  echo "   ---"

  LOG_GROUP="/ecs/$PROJECT_NAME"
  RECENT_ERRORS=$(aws logs tail $LOG_GROUP \
    --region $AWS_REGION \
    --follow=false \
    --since 5m \
    --filter-pattern "[ERROR, error, ERR]" \
    --format short 2>/dev/null | head -5)

  if [ -z "$RECENT_ERRORS" ]; then
    echo "   ✓ No errors in last 5 minutes"
  else
    echo "$RECENT_ERRORS"
  fi

  echo ""
  echo "=================================================="
  echo "Auto-refresh in ${REFRESH_INTERVAL}s... (Press Ctrl+C to stop)"
}

# Check for one-time run flag
if [ "$1" = "-once" ]; then
  display_status
  exit 0
fi

# Continuous monitoring loop
while true; do
  display_status
  sleep $REFRESH_INTERVAL
done
