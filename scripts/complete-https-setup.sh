#!/bin/bash
# Complete HTTPS Setup - Interactive wizard for end-to-end configuration
# Sets up ACM certificate, configures ALB, and DNS in one go

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          ConnektX Complete HTTPS Setup Wizard                  ║"
echo "║                                                                ║"
echo "║  This wizard will:                                            ║"
echo "║  ✓ Create an SSL/TLS certificate                             ║"
echo "║  ✓ Configure ALB for HTTPS                                   ║"
echo "║  ✓ Setup DNS with Route53                                    ║"
echo "║  ✓ Test HTTPS connectivity                                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
PROJECT_NAME="connektx-web"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Step 1: Collect user inputs
echo "📋 Configuration"
echo "================="
echo ""

# Get custom domain
read -p "Enter your custom domain (e.g., yourdomain.com): " CUSTOM_DOMAIN

if [ -z "$CUSTOM_DOMAIN" ]; then
  echo "❌ Error: Domain is required"
  exit 1
fi

# Confirm domain
echo ""
echo "Domain: $CUSTOM_DOMAIN"
read -p "Is this correct? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Setup cancelled"
  exit 1
fi

# Optional: Enable wildcard
echo ""
echo "Wildcard certificates allow:"
echo "  - yourdomain.com ✓"
echo "  - *.yourdomain.com ✓"
echo ""
read -p "Enable wildcard certificate? (y/n) " -n 1 -r
echo
ENABLE_WILDCARD="false"
if [[ $REPLY =~ ^[Yy]$ ]]; then
  ENABLE_WILDCARD="true"
fi

# DNS provider
echo ""
echo "Which DNS provider do you use?"
echo "  1) Hostinger (manual setup)"
echo "  2) Route53 (automatic setup)"
echo "  3) Other (manual setup)"
echo ""
read -p "Select (1-3): " DNS_PROVIDER

case $DNS_PROVIDER in
  1)
    DNS_TYPE="hostinger"
    echo "✓ Hostinger selected"
    ;;
  2)
    DNS_TYPE="route53"
    echo "✓ Route53 selected"
    ;;
  *)
    DNS_TYPE="manual"
    echo "✓ Manual setup selected"
    ;;
esac

export DNS_TYPE

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""

# Export environment variables for scripts
export AWS_REGION
export CUSTOM_DOMAIN
export ENABLE_WILDCARD
export HOSTED_ZONE_ID

# Step 2: Request ACM Certificate
echo ""
echo "🔐 Step 1/4: Requesting ACM Certificate"
echo "========================================"
echo ""

bash "$SCRIPT_DIR/setup-acm-certificate.sh"

# Extract certificate ARN from ACM
ACM_CERTIFICATE_ARN=$(aws acm list-certificates \
  --region $AWS_REGION \
  --query "CertificateSummaryList[?DomainName=='$CUSTOM_DOMAIN'].CertificateArn" \
  --output text)

if [ -z "$ACM_CERTIFICATE_ARN" ] || [ "$ACM_CERTIFICATE_ARN" = "None" ]; then
  echo ""
  echo "❌ Error: Could not find certificate ARN"
  echo "Please run: bash scripts/setup-acm-certificate.sh"
  exit 1
fi

# Check if certificate is issued
CERT_STATUS=$(aws acm describe-certificate \
  --certificate-arn $ACM_CERTIFICATE_ARN \
  --region $AWS_REGION \
  --query "Certificate.Status" \
  --output text)

if [ "$CERT_STATUS" != "ISSUED" ]; then
  echo ""
  echo "⚠️  Certificate is not yet issued"
  echo "   Status: $CERT_STATUS"
  echo ""
  echo "Action required:"
  echo "  1. Add the DNS validation records to your domain registrar"
  echo "  2. Wait 5-30 minutes for validation"
  echo "  3. Run this script again:"
  echo "     bash scripts/complete-https-setup.sh"
  echo ""
  exit 0
fi

# Step 3: Configure ALB HTTPS
echo ""
echo "🔄 Step 2/4: Configuring ALB for HTTPS"
echo "======================================"
echo ""

export ACM_CERTIFICATE_ARN
bash "$SCRIPT_DIR/configure-alb-https.sh"

# Step 4: Setup DNS
echo ""

if [ "$DNS_TYPE" = "route53" ]; then
  echo "🌐 Step 3/4: Setting up DNS with Route53"
  echo "========================================="
  echo ""
  bash "$SCRIPT_DIR/setup-dns-route53.sh"
elif [ "$DNS_TYPE" = "hostinger" ]; then
  echo "🌐 Step 3/4: Setting up DNS with Hostinger"
  echo "=========================================="
  echo ""
  bash "$SCRIPT_DIR/setup-dns-hostinger.sh"
else
  echo "🌐 Step 3/4: Setting up DNS (Manual)"
  echo "===================================="
  echo ""
  echo "Please manually configure your DNS provider to point:"
  echo ""
  ALB_DNS=$(aws elbv2 describe-load-balancers \
    --names connektx-web-alb \
    --region ap-south-1 \
    --query "LoadBalancers[0].DNSName" \
    --output text)
  echo "Domain: $CUSTOM_DOMAIN"
  echo "Point to: $ALB_DNS"
  echo ""
fi

echo ""
echo "⏳ Waiting for DNS propagation..."
echo "   This may take up to 48 hours, but usually 5-15 minutes"
echo ""

# Step 5: Test HTTPS
echo "🔒 Step 4/4: Testing HTTPS Connection"
echo "====================================="
echo ""

read -p "Do you want to test HTTPS now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  bash "$SCRIPT_DIR/test-https.sh"
else
  echo "   You can test later with:"
  echo "   bash scripts/test-https.sh"
fi

# Final Summary
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ Setup Complete!                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📍 Next Steps:"
echo ""

echo "1. ✓ ACM Certificate:"
echo "   Status: ISSUED"
echo "   ARN: $ACM_CERTIFICATE_ARN"
echo ""

echo "2. ✓ ALB HTTPS Configuration:"
echo "   - Port 443 (HTTPS): Active"
echo "   - Port 80 (HTTP): Redirects to HTTPS"
echo ""

echo "3. ⏳ DNS Setup:"
echo "   - Route53 A record created"
echo "   - Waiting for DNS propagation (5-48 hours)"
echo ""

echo "4. 🧪 Testing:"
echo "   Your domain should be accessible in 5-30 minutes"
echo "   Test with:"
echo "     curl -I https://$CUSTOM_DOMAIN"
echo "     bash scripts/test-https.sh"
echo ""

echo "📊 Monitoring:"
echo "   Watch ALB and ECS status:"
echo "     bash scripts/monitor-alb.sh"
echo ""

echo "📚 Documentation:"
echo "   Read the complete guide:"
echo "     cat HTTPS_SETUP_GUIDE.md"
echo ""

echo "💾 Save these details:"
echo "   export AWS_REGION=$AWS_REGION"
echo "   export PROJECT_NAME=$PROJECT_NAME"
echo "   export CUSTOM_DOMAIN=$CUSTOM_DOMAIN"
echo "   export ACM_CERTIFICATE_ARN=$ACM_CERTIFICATE_ARN"
echo ""

echo "═════════════════════════════════════════════════════════════════"
echo ""
