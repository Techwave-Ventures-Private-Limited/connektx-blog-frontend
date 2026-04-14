#!/bin/bash
# Setup AWS Certificate Manager (ACM) Certificate for custom domain with HTTPS
# This script validates and provisions an SSL/TLS certificate for your custom domain

set -e

echo "🔐 ACM Certificate Setup"
echo "========================"
echo ""

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
PROJECT_NAME="connektx-web"
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-connektx.com}"
ENABLE_WILDCARD="${ENABLE_WILDCARD:-true}"

# Validate inputs
if [ -z "$CUSTOM_DOMAIN" ]; then
  echo "❌ Error: CUSTOM_DOMAIN environment variable not set"
  echo ""
  echo "Usage:"
  echo "  export CUSTOM_DOMAIN=yourdomain.com"
  echo "  bash scripts/setup-acm-certificate.sh"
  echo ""
  echo "Optional: Enable wildcard certificate"
  echo "  export ENABLE_WILDCARD=true  # includes *.yourdomain.com"
  echo ""
  exit 1
fi

echo "Configuration:"
echo "  Domain: $CUSTOM_DOMAIN"
echo "  Wildcard: $ENABLE_WILDCARD"
echo "  Region: $AWS_REGION"
echo ""

# 1. Check if certificate already exists
echo "1/5 🔍 Checking for existing certificate..."

CERT_ARN=$(aws acm list-certificates \
  --region $AWS_REGION \
  --query "CertificateSummaryList[?DomainName=='$CUSTOM_DOMAIN'].CertificateArn" \
  --output text)

if [ -n "$CERT_ARN" ] && [ "$CERT_ARN" != "None" ]; then
  CERT_STATUS=$(aws acm describe-certificate \
    --certificate-arn $CERT_ARN \
    --region $AWS_REGION \
    --query "Certificate.Status" \
    --output text)

  echo "    ✓ Certificate already exists"
  echo "    Status: $CERT_STATUS"
  echo "    ARN: $CERT_ARN"
  echo ""

  if [ "$CERT_STATUS" != "ISSUED" ]; then
    echo "⚠️  Certificate is not yet issued (Status: $CERT_STATUS)"
    echo ""
    echo "Pending validation details:"
    aws acm describe-certificate \
      --certificate-arn $CERT_ARN \
      --region $AWS_REGION \
      --query "Certificate.ValidationOptions" \
      --output table
    echo ""
    echo "Please validate the certificate via the validation email and try again."
    exit 0
  fi

  echo "✅ Certificate is ready to use!"
  echo ""
  echo "Certificate Details:"
  aws acm describe-certificate \
    --certificate-arn $CERT_ARN \
    --region $AWS_REGION \
    --query "Certificate.[DomainName,SubjectAlternativeNames,NotBefore,NotAfter,Status]" \
    --output text | awk '{print "  Domain: " $1 "\n  Validity: " $3 " to " $4 "\n  Status: " $5}'

  echo ""
  echo "Save this ARN for use with ALB:"
  echo "  ACM_CERTIFICATE_ARN=$CERT_ARN"
  exit 0
fi

# 2. Request certificate
echo "2/5 📋 Requesting ACM certificate..."

DOMAIN_VALIDATION_OPTIONS=""
if [ "$ENABLE_WILDCARD" = "true" ]; then
  DOMAIN_VALIDATION_OPTIONS="DomainName=$CUSTOM_DOMAIN SubjectAlternativeNames=$CUSTOM_DOMAIN,*.$CUSTOM_DOMAIN"
  echo "    Domains: $CUSTOM_DOMAIN, *.$CUSTOM_DOMAIN"
else
  DOMAIN_VALIDATION_OPTIONS="DomainName=$CUSTOM_DOMAIN"
  echo "    Domain: $CUSTOM_DOMAIN"
fi

CERT_ARN=$(aws acm request-certificate \
  --domain-name $CUSTOM_DOMAIN \
  $(if [ "$ENABLE_WILDCARD" = "true" ]; then echo "--subject-alternative-names *.$CUSTOM_DOMAIN"; fi) \
  --validation-method DNS \
  --region $AWS_REGION \
  --query "CertificateArn" \
  --output text)

echo "    ✓ Certificate requested"
echo "    ARN: $CERT_ARN"
echo ""

# 3. Get validation details
echo "3/5 🔗 DNS Validation Records"
echo ""

sleep 2

VALIDATION_OPTIONS=$(aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region $AWS_REGION \
  --query "Certificate.DomainValidationOptions" \
  --output json)

echo "    📍 Add these DNS records to Hostinger:"
echo ""
echo "    $VALIDATION_OPTIONS" | jq -r '.[] |
  "    Domain: \(.DomainName)\n    Name: \(.ResourceRecord.Name)\n    Type: \(.ResourceRecord.Type)\n    Value: \(.ResourceRecord.Value)\n"'

echo ""
echo "    🔧 Hostinger DNS Setup Instructions:"
echo "    1. Go to: https://hpanel.hostinger.com/"
echo "    2. Select your domain"
echo "    3. Click 'DNS Zone Editor'"
echo "    4. Click 'Add Record'"
echo "    5. Type: CNAME"
echo "    6. Name: (copy from above)"
echo "    7. Value: (copy from above)"
echo "    8. Click 'Save'"
echo ""
echo "    ⏳ After adding record, wait 5-30 minutes for validation"
echo ""

# 4. Wait for validation (optional)
echo "4/5 ⏳ Validation Status"
echo ""

read -p "    Do you want to wait for certificate validation? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "    Waiting for validation (timeout: 10 minutes)..."

  for i in {1..60}; do
    CERT_STATUS=$(aws acm describe-certificate \
      --certificate-arn $CERT_ARN \
      --region $AWS_REGION \
      --query "Certificate.Status" \
      --output text)

    if [ "$CERT_STATUS" = "ISSUED" ]; then
      echo "    ✓ Certificate issued!"
      break
    fi

    echo "    Status: $CERT_STATUS (attempt $i/60)"
    sleep 10
  done

  if [ "$CERT_STATUS" != "ISSUED" ]; then
    echo "    ⚠️  Validation timeout. Please check DNS records and validate manually."
    echo ""
    echo "    Check status at:"
    echo "    aws acm describe-certificate --certificate-arn $CERT_ARN --region $AWS_REGION"
  fi
else
  echo "    Skipped. You can check status later with:"
  echo "    aws acm describe-certificate --certificate-arn $CERT_ARN --region $AWS_REGION"
fi

echo ""

# 5. Summary
echo "5/5 📝 Summary"
echo ""

FINAL_STATUS=$(aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region $AWS_REGION \
  --query "Certificate.Status" \
  --output text)

if [ "$FINAL_STATUS" = "ISSUED" ]; then
  echo "✅ ACM Certificate Ready!"
  echo ""
  echo "Certificate Details:"
  echo "  ARN: $CERT_ARN"
  echo "  Domain: $CUSTOM_DOMAIN"
  echo "  Status: $FINAL_STATUS"
  echo ""
  echo "Next step: Configure HTTPS on ALB"
  echo "  bash scripts/configure-alb-https.sh"
  echo ""
  echo "Save this for later use:"
  echo "  export ACM_CERTIFICATE_ARN=$CERT_ARN"
else
  echo "⏳ ACM Certificate Pending Validation"
  echo ""
  echo "Certificate Details:"
  echo "  ARN: $CERT_ARN"
  echo "  Status: $FINAL_STATUS"
  echo ""
  echo "Action Required:"
  echo "1. Add DNS validation records to your domain registrar"
  echo "2. Wait 5-30 minutes for validation"
  echo "3. Check status:"
  echo "   aws acm describe-certificate --certificate-arn $CERT_ARN --region $AWS_REGION"
  echo ""
  echo "Once validated, configure HTTPS on ALB:"
  echo "  export ACM_CERTIFICATE_ARN=$CERT_ARN"
  echo "  bash scripts/configure-alb-https.sh"
fi

echo ""
