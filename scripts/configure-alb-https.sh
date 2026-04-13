#!/bin/bash
# Configure ALB for HTTPS with ACM Certificate and custom domain
# Adds HTTPS listener and redirects HTTP to HTTPS

set -e

echo "🔐 ALB HTTPS Configuration"
echo "=========================="
echo ""

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
PROJECT_NAME="connektx-web"
ACM_CERTIFICATE_ARN="${ACM_CERTIFICATE_ARN:-}"
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-connektx.com}"

# Validate inputs
if [ -z "$ACM_CERTIFICATE_ARN" ]; then
  echo "❌ Error: ACM_CERTIFICATE_ARN environment variable not set"
  echo ""
  echo "Usage:"
  echo "  export ACM_CERTIFICATE_ARN=arn:aws:acm:region:account:certificate/id"
  echo "  bash scripts/configure-alb-https.sh"
  echo ""
  exit 1
fi

if [ -z "$CUSTOM_DOMAIN" ]; then
  echo "❌ Error: CUSTOM_DOMAIN environment variable not set"
  echo ""
  echo "Usage:"
  echo "  export CUSTOM_DOMAIN=yourdomain.com"
  echo "  bash scripts/configure-alb-https.sh"
  echo ""
  exit 1
fi

echo "Configuration:"
echo "  Domain: $CUSTOM_DOMAIN"
echo "  Certificate ARN: $ACM_CERTIFICATE_ARN"
echo "  Region: $AWS_REGION"
echo ""

# 1. Get ALB information
echo "1/4 🔍 Getting ALB information..."

ALB_NAME="${PROJECT_NAME}-alb"
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --names $ALB_NAME \
  --region $AWS_REGION \
  --query "LoadBalancers[0].LoadBalancerArn" \
  --output text 2>/dev/null)

if [ "$ALB_ARN" = "None" ] || [ -z "$ALB_ARN" ]; then
  echo "❌ Error: ALB not found"
  echo "   Run: bash scripts/setup-aws-infrastructure.sh"
  exit 1
fi

echo "    ✓ ALB found: $ALB_ARN"
echo ""

# 2. Get target group ARN
echo "2/4 🎯 Getting target group..."

TG_NAME="${PROJECT_NAME}-tg"
TG_ARN=$(aws elbv2 describe-target-groups \
  --names $TG_NAME \
  --region $AWS_REGION \
  --query "TargetGroups[0].TargetGroupArn" \
  --output text 2>/dev/null)

if [ "$TG_ARN" = "None" ] || [ -z "$TG_ARN" ]; then
  echo "❌ Error: Target group not found"
  exit 1
fi

echo "    ✓ Target group found: $TG_ARN"
echo ""

# 3. Create HTTPS listener
echo "3/4 🔒 Setting up HTTPS listener..."

# Check if HTTPS listener already exists
HTTPS_LISTENER=$(aws elbv2 describe-listeners \
  --load-balancer-arn $ALB_ARN \
  --region $AWS_REGION \
  --query "Listeners[?Port==\`443\`].ListenerArn" \
  --output text 2>/dev/null)

if [ -n "$HTTPS_LISTENER" ] && [ "$HTTPS_LISTENER" != "None" ]; then
  echo "    ✓ HTTPS listener already exists"
  echo "    Updating certificate..."

  # Update listener with new certificate
  aws elbv2 modify-listener \
    --listener-arn $HTTPS_LISTENER \
    --protocol HTTPS \
    --port 443 \
    --certificates CertificateArn=$ACM_CERTIFICATE_ARN \
    --default-actions Type=forward,TargetGroupArn=$TG_ARN \
    --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
    --region $AWS_REGION >/dev/null

  echo "    ✓ Certificate updated"
else
  echo "    Creating HTTPS listener..."

  # Create HTTPS listener
  aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTPS \
    --port 443 \
    --certificates CertificateArn=$ACM_CERTIFICATE_ARN \
    --default-actions Type=forward,TargetGroupArn=$TG_ARN \
    --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
    --region $AWS_REGION >/dev/null

  echo "    ✓ HTTPS listener created"
fi

echo ""

# 4. Configure HTTP to HTTPS redirect
echo "4/4 🔄 Configuring HTTP→HTTPS redirect..."

# Get HTTP listener ARN
HTTP_LISTENER=$(aws elbv2 describe-listeners \
  --load-balancer-arn $ALB_ARN \
  --region $AWS_REGION \
  --query "Listeners[?Port==\`80\`].ListenerArn" \
  --output text)

if [ -n "$HTTP_LISTENER" ] && [ "$HTTP_LISTENER" != "None" ]; then
  # Update HTTP listener to redirect to HTTPS
  aws elbv2 modify-listener \
    --listener-arn $HTTP_LISTENER \
    --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}" \
    --region $AWS_REGION >/dev/null

  echo "    ✓ HTTP traffic redirected to HTTPS"
else
  echo "    ✓ No HTTP listener found (OK)"
fi

echo ""

# 5. Summary
echo "✅ HTTPS Configuration Complete!"
echo "==============================="
echo ""

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --region $AWS_REGION \
  --query "LoadBalancers[0].DNSName" \
  --output text)

echo "ALB Details:"
echo "  DNS Name: $ALB_DNS"
echo "  HTTPS Port: 443"
echo "  HTTP Port: 80 (redirects to HTTPS)"
echo ""

echo "Next steps:"
echo ""
echo "1️⃣  Create Route53 DNS record (or use your registrar):"
echo ""
echo "   Option A - Using Route53:"
echo "     aws route53 list-hosted-zones"
echo "     # Find your zone ID"
echo ""
echo "     aws route53 change-resource-record-sets \\"
echo "       --hosted-zone-id Z1234567890ABC \\"
echo "       --change-batch '{"
echo "         \"Changes\": [{"
echo "           \"Action\": \"CREATE\","
echo "           \"ResourceRecordSet\": {"
echo "             \"Name\": \"$CUSTOM_DOMAIN\","
echo "             \"Type\": \"A\","
echo "             \"AliasTarget\": {"
echo "               \"HostedZoneId\": \"Z2FDTNDATAQYW2\","
echo "               \"DNSName\": \"$ALB_DNS\","
echo "               \"EvaluateTargetHealth\": false"
echo "             }"
echo "           }"
echo "         }]"
echo "       }'"
echo ""
echo "   Option B - Using your domain registrar:"
echo "     Create an A record or CNAME record pointing to:"
echo "     $ALB_DNS"
echo ""

echo "2️⃣  Test HTTPS connection:"
echo "     curl -I https://$CUSTOM_DOMAIN"
echo ""

echo "3️⃣  Monitor ALB health:"
echo "     bash scripts/monitor-alb.sh"
echo ""

echo "SSL/TLS Configuration Details:"
echo "  Security Policy: ELBSecurityPolicy-TLS-1-2-2017-01"
echo "  Minimum TLS: 1.2"
echo "  Certificate: $ACM_CERTIFICATE_ARN"
echo ""
