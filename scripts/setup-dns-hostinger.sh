#!/bin/bash
# Setup Hostinger DNS to point custom domain to ALB
# Manual steps - Hostinger doesn't have API for this yet

set -e

echo "🌐 Hostinger DNS Configuration"
echo "=============================="
echo ""

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
PROJECT_NAME="connektx-web"
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-connektx.com}"

if [ -z "$CUSTOM_DOMAIN" ]; then
  echo "❌ Error: CUSTOM_DOMAIN environment variable not set"
  echo ""
  echo "Usage:"
  echo "  export CUSTOM_DOMAIN=yourdomain.com"
  echo "  bash scripts/setup-dns-hostinger.sh"
  echo ""
  exit 1
fi

echo "Configuration:"
echo "  Domain: $CUSTOM_DOMAIN"
echo "  Region: $AWS_REGION"
echo ""

# Get ALB details
echo "1/3 🔍 Getting ALB details..."
echo ""

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

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --region $AWS_REGION \
  --query "LoadBalancers[0].DNSName" \
  --output text)

echo "✓ ALB DNS Name:"
echo "  $ALB_DNS"
echo ""

# Step 2: Display Hostinger instructions
echo "2/3 📋 Hostinger DNS Configuration"
echo ""

echo "Login to Hostinger and add DNS records:"
echo ""

echo "🔗 STEP 1: Login to Hostinger"
echo "  URL: https://hpanel.hostinger.com/"
echo "  Select your domain: $CUSTOM_DOMAIN"
echo ""

echo "🔗 STEP 2: Add root domain record (@)"
echo "  Click 'DNS Zone Editor' → 'Add Record'"
echo "  ---"
echo "  Type: CNAME"
echo "  Name: @"
echo "  Value: $ALB_DNS"
echo "  TTL: 3600 (default)"
echo "  ---"
echo "  Then click 'Save'"
echo ""

echo "🔗 STEP 3: Add www subdomain record (optional)"
echo "  Click 'Add Record' again"
echo "  ---"
echo "  Type: CNAME"
echo "  Name: www"
echo "  Value: $ALB_DNS"
echo "  TTL: 3600 (default)"
echo "  ---"
echo "  Then click 'Save'"
echo ""

# Step 3: Test DNS
echo "3/3 🧪 Test DNS Resolution"
echo ""

echo "After adding DNS records in Hostinger:"
echo ""
echo "  1. Wait 5-30 minutes for DNS propagation"
echo ""
echo "  2. Test DNS resolution:"
echo "     nslookup $CUSTOM_DOMAIN"
echo "     dig $CUSTOM_DOMAIN +short"
echo ""
echo "     Should show ALB DNS name:"
echo "     $ALB_DNS"
echo ""
echo "  3. Test HTTPS connectivity:"
echo "     curl -I https://$CUSTOM_DOMAIN"
echo ""

# Summary
echo "✅ Hostinger DNS Setup Complete!"
echo "=================================="
echo ""

echo "📍 What you added:"
echo "  Root Domain (@): CNAME → $ALB_DNS"
echo "  www Subdomain:   CNAME → $ALB_DNS"
echo ""

echo "⏳ DNS Propagation:"
echo "  Usually: 5-30 minutes"
echo "  Maximum: 48 hours"
echo ""

echo "🧪 Verify DNS:"
echo "   bash scripts/test-https.sh"
echo ""

echo "📊 Monitor ALB:"
echo "   bash scripts/monitor-alb.sh"
echo ""

echo "⚠️  Note: Hostinger uses a DNS propagation system."
echo "   If DNS doesn't resolve, try:"
echo "   1. Clear browser cache"
echo "   2. Restart router (flush DNS)"
echo "   3. Use 8.8.8.8 to test: dig @8.8.8.8 $CUSTOM_DOMAIN"
echo ""
