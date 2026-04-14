#!/bin/bash
# Setup Route53 DNS record to point custom domain to ALB
# Creates an A record (alias) pointing to the load balancer

set -e

echo "🌐 Route53 DNS Configuration"
echo "============================"
echo ""

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
PROJECT_NAME="connektx-web"
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-}"
HOSTED_ZONE_ID="${HOSTED_ZONE_ID:-}"
ZONE_ID_MAPPING="Z2FDTNDATAQYW2"  # CloudFront/ALB zone ID for ap-south-1

# Validate inputs
if [ -z "$CUSTOM_DOMAIN" ]; then
  echo "❌ Error: CUSTOM_DOMAIN environment variable not set"
  echo ""
  echo "Usage:"
  echo "  export CUSTOM_DOMAIN=yourdomain.com"
  echo "  bash scripts/setup-dns-route53.sh"
  echo ""
  echo "Optional: Specify hosted zone ID"
  echo "  export HOSTED_ZONE_ID=Z1234567890ABC"
  echo ""
  exit 1
fi

echo "Configuration:"
echo "  Domain: $CUSTOM_DOMAIN"
echo "  Region: $AWS_REGION"
echo ""

# 1. Get ALB DNS name
echo "1/4 🔍 Getting ALB details..."

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

ALB_ZONE_ID=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --region $AWS_REGION \
  --query "LoadBalancers[0].CanonicalHostedZoneId" \
  --output text)

echo "    ✓ ALB DNS: $ALB_DNS"
echo "    ✓ ALB Zone ID: $ALB_ZONE_ID"
echo ""

# 2. Find or verify hosted zone
echo "2/4 🏠 Finding Route53 hosted zone..."

if [ -z "$HOSTED_ZONE_ID" ]; then
  # Extract domain from subdomain if needed
  ZONE_DOMAIN=$CUSTOM_DOMAIN
  if [[ $CUSTOM_DOMAIN == *.* ]]; then
    # Try to find zone by domain
    ZONE=$(aws route53 list-hosted-zones-by-name \
      --dns-name $ZONE_DOMAIN \
      --region $AWS_REGION \
      --query "HostedZones[0]" \
      --output json)

    HOSTED_ZONE_ID=$(echo $ZONE | jq -r '.Id' | cut -d'/' -f3)

    if [ -z "$HOSTED_ZONE_ID" ] || [ "$HOSTED_ZONE_ID" = "null" ]; then
      echo "❌ Error: Could not find hosted zone for $CUSTOM_DOMAIN"
      echo ""
      echo "Available hosted zones:"
      aws route53 list-hosted-zones --query "HostedZones[*].[Id,Name]" --output table
      echo ""
      echo "Create a hosted zone first:"
      echo "  aws route53 create-hosted-zone --name $CUSTOM_DOMAIN --caller-reference $(date +%s)"
      exit 1
    fi
  fi
fi

ZONE_INFO=$(aws route53 get-hosted-zone \
  --id $HOSTED_ZONE_ID \
  --query "HostedZone" \
  --output json)

ZONE_NAME=$(echo $ZONE_INFO | jq -r '.Name')

echo "    ✓ Hosted zone found"
echo "    ID: $HOSTED_ZONE_ID"
echo "    Name: $ZONE_NAME"
echo ""

# 3. Create/update DNS record
echo "3/4 📝 Creating DNS record..."

# Check if record already exists
EXISTING_RECORD=$(aws route53 list-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --query "ResourceRecordSets[?Name=='$CUSTOM_DOMAIN.'].Name" \
  --output text 2>/dev/null)

if [ -n "$EXISTING_RECORD" ] && [ "$EXISTING_RECORD" != "None" ]; then
  echo "    ⚠️  Record already exists for $CUSTOM_DOMAIN"
  echo "    Updating to point to new ALB..."

  CHANGE_BATCH=$(cat <<EOF
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "$CUSTOM_DOMAIN",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "$ALB_ZONE_ID",
        "DNSName": "$ALB_DNS",
        "EvaluateTargetHealth": false
      }
    }
  }]
}
EOF
)
else
  echo "    Creating new DNS record..."

  CHANGE_BATCH=$(cat <<EOF
{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "$CUSTOM_DOMAIN",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "$ALB_ZONE_ID",
        "DNSName": "$ALB_DNS",
        "EvaluateTargetHealth": false
      }
    }
  }]
}
EOF
)
fi

CHANGE_ID=$(aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch "$CHANGE_BATCH" \
  --query "ChangeInfo.Id" \
  --output text)

echo "    ✓ DNS record updated"
echo "    Change ID: $CHANGE_ID"
echo ""

# 4. Create wildcard subdomain record (optional)
echo "4/4 🎯 Creating wildcard subdomain (optional)..."

read -p "    Do you want to create a wildcard record (*.yourdomain.com)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  WILDCARD_DOMAIN="*.$CUSTOM_DOMAIN"

  WILDCARD_BATCH=$(cat <<EOF
{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "$WILDCARD_DOMAIN",
      "Type": "A",
      "AliasTarget": {
        "HostedZoneId": "$ALB_ZONE_ID",
        "DNSName": "$ALB_DNS",
        "EvaluateTargetHealth": false
      }
    }
  }]
}
EOF
)

  aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch "$WILDCARD_BATCH" \
    --region $AWS_REGION 2>/dev/null || echo "    ℹ️  Wildcard record already exists or could not be created"

  echo "    ✓ Wildcard record created"
fi

echo ""

# 5. Summary
echo "✅ DNS Configuration Complete!"
echo "=============================="
echo ""

echo "DNS Record Details:"
echo "  Domain: $CUSTOM_DOMAIN"
echo "  Type: A (Alias)"
echo "  Target: $ALB_DNS"
echo "  Hosted Zone: $HOSTED_ZONE_ID"
echo ""

echo "DNS Propagation:"
echo "  DNS records can take up to 48 hours to propagate globally"
echo "  Check propagation:"
echo "    nslookup $CUSTOM_DOMAIN"
echo "    dig $CUSTOM_DOMAIN"
echo ""

echo "Test connection:"
echo "  Check HTTP: curl -I http://$CUSTOM_DOMAIN"
echo "  Check HTTPS: curl -I https://$CUSTOM_DOMAIN"
echo ""

echo "Name Servers for domain registrar:"
aws route53 get-hosted-zone \
  --id $HOSTED_ZONE_ID \
  --query "DelegationSet.NameServers" \
  --output text | awk '{for(i=1;i<=NF;i++) print "  " $i}'

echo ""
