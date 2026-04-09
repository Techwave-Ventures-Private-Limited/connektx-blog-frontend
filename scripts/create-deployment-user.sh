#!/bin/bash
# Create IAM user for GitHub Actions deployment

set -e

PROJECT_NAME="connektx-web"
IAM_USER_NAME="github-deploy-connektx"
AWS_REGION="${AWS_REGION:-ap-south-1}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "Creating IAM user for deployment..."
echo "===================================="
echo ""

# Create IAM user
echo "1. Creating IAM user: $IAM_USER_NAME"
if aws iam get-user --user-name $IAM_USER_NAME >/dev/null 2>&1; then
  echo "   ✓ User already exists"
else
  aws iam create-user --user-name $IAM_USER_NAME
  echo "   ✓ User created"
fi

# Create IAM policy with minimal required permissions
echo ""
echo "2. Creating deployment policy..."
POLICY_NAME="ConnektXDeploymentPolicy"
POLICY_DOCUMENT=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSAccess",
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:DescribeServices",
        "ecs:UpdateService"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMPassRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": [
        "arn:aws:iam::${AWS_ACCOUNT_ID}:role/${PROJECT_NAME}-execution-role",
        "arn:aws:iam::${AWS_ACCOUNT_ID}:role/${PROJECT_NAME}-task-role"
      ]
    }
  ]
}
EOF
)

# Check if policy exists, create or update
POLICY_ARN=$(aws iam list-policies --scope Local --query "Policies[?PolicyName=='$POLICY_NAME'].Arn" --output text)

if [ -z "$POLICY_ARN" ]; then
  POLICY_ARN=$(aws iam create-policy \
    --policy-name $POLICY_NAME \
    --policy-document "$POLICY_DOCUMENT" \
    --description "Minimal permissions for ConnektX GitHub Actions deployment" \
    --query "Policy.Arn" \
    --output text)
  echo "   ✓ Policy created: $POLICY_ARN"
else
  # Update existing policy (create new version)
  aws iam create-policy-version \
    --policy-arn $POLICY_ARN \
    --policy-document "$POLICY_DOCUMENT" \
    --set-as-default >/dev/null 2>&1 || true
  echo "   ✓ Policy already exists: $POLICY_ARN"
fi

# Attach policy to user
echo ""
echo "3. Attaching policy to user..."
aws iam attach-user-policy \
  --user-name $IAM_USER_NAME \
  --policy-arn $POLICY_ARN 2>/dev/null || echo "   ✓ Policy already attached"
echo "   ✓ Policy attached"

# Create access key
echo ""
echo "4. Creating access key..."
ACCESS_KEY_EXISTS=$(aws iam list-access-keys --user-name $IAM_USER_NAME --query "AccessKeyMetadata[?Status=='Active'].AccessKeyId" --output text)

if [ -n "$ACCESS_KEY_EXISTS" ]; then
  echo "   ⚠️  Active access key already exists: $ACCESS_KEY_EXISTS"
  echo "   Use existing key or delete it first with:"
  echo "   aws iam delete-access-key --user-name $IAM_USER_NAME --access-key-id $ACCESS_KEY_EXISTS"
  echo ""
  echo "✅ IAM user ready: $IAM_USER_NAME"
else
  # Create access key and parse output without jq dependency
  ACCESS_KEY_INFO=$(aws iam create-access-key --user-name $IAM_USER_NAME --output text)
  ACCESS_KEY_ID=$(echo "$ACCESS_KEY_INFO" | awk '{print $2}')
  SECRET_ACCESS_KEY=$(echo "$ACCESS_KEY_INFO" | awk '{print $4}')

  echo "   ✓ Access key created"
  echo ""
  echo "=========================================="
  echo "✅ Deployment User Created!"
  echo "=========================================="
  echo ""
  echo "📋 Add these to GitHub Secrets:"
  echo ""
  echo "AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID"
  echo "AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
  echo ""
  echo "⚠️  IMPORTANT: Save these credentials now!"
  echo "The secret key will not be shown again."
  echo ""
  echo "Go to: https://github.com/YOUR_USERNAME/connektx-web/settings/secrets/actions"
  echo "Add both secrets above."
  echo ""
fi

echo "=========================================="
echo "IAM User Details:"
echo "   User: $IAM_USER_NAME"
echo "   Policy: $POLICY_NAME"
echo "   Permissions: ECR + ECS (minimal deployment access)"
echo "=========================================="
