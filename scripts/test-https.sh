#!/bin/bash
# Test HTTPS connectivity and SSL certificate
# Verifies your domain is accessible via HTTPS with valid certificate

set -e

echo "🔒 HTTPS Connection Test"
echo "========================"
echo ""

# Configuration
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-connektx.com}"

if [ -z "$CUSTOM_DOMAIN" ]; then
  echo "❌ Error: CUSTOM_DOMAIN environment variable not set"
  echo ""
  echo "Usage:"
  echo "  export CUSTOM_DOMAIN=yourdomain.com"
  echo "  bash scripts/test-https.sh"
  echo ""
  exit 1
fi

echo "Testing: $CUSTOM_DOMAIN"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
  echo "❌ Error: curl not installed"
  exit 1
fi

# 1. Test HTTP connectivity (should redirect)
echo "1. 🔄 Testing HTTP (should redirect to HTTPS)..."
echo "   curl -I http://$CUSTOM_DOMAIN"
echo ""

HTTP_RESPONSE=$(curl -s -I -L http://$CUSTOM_DOMAIN 2>&1 | head -1)
echo "   Response: $HTTP_RESPONSE"
echo ""

# 2. Test HTTPS connectivity
echo "2. 🔐 Testing HTTPS connection..."
echo "   curl -I https://$CUSTOM_DOMAIN"
echo ""

HTTPS_RESPONSE=$(curl -s -I https://$CUSTOM_DOMAIN 2>&1 | head -1)
echo "   Response: $HTTPS_RESPONSE"
echo ""

# 3. Check SSL certificate details
echo "3. 📜 SSL Certificate Details"
echo ""

# Get certificate info using openssl
CERT_INFO=$(echo | openssl s_client -servername $CUSTOM_DOMAIN -connect $CUSTOM_DOMAIN:443 2>/dev/null | \
  openssl x509 -noout -subject -issuer -dates 2>/dev/null)

if [ -z "$CERT_INFO" ]; then
  echo "   ⚠️  Could not retrieve certificate info"
  echo "   The domain may not be properly configured yet."
else
  echo "$CERT_INFO" | sed 's/^/   /'
fi

echo ""

# 4. Test DNS resolution
echo "4. 🌐 DNS Resolution"
echo ""

if command -v nslookup &> /dev/null; then
  echo "   nslookup $CUSTOM_DOMAIN"
  echo ""
  DNS_RESULT=$(nslookup $CUSTOM_DOMAIN 2>&1 | grep -A 1 "Name:" | head -3)
  if [ -n "$DNS_RESULT" ]; then
    echo "$DNS_RESULT" | sed 's/^/   /'
  else
    echo "   ⚠️  Could not resolve domain"
  fi
else
  echo "   ℹ️  nslookup not available"
fi

echo ""

# 5. Check Response Headers
echo "5. 📋 Response Headers"
echo ""

HEADERS=$(curl -s -I https://$CUSTOM_DOMAIN 2>&1)
echo "$HEADERS" | sed 's/^/   /'

echo ""

# 6. Summary
echo "✅ Test Complete!"
echo ""

# Check if everything is working
if echo "$HTTPS_RESPONSE" | grep -q "200\|301\|302"; then
  echo "✓ HTTPS connection successful!"
  echo ""
  echo "Your domain is properly configured and accessible via HTTPS."
else
  echo "⚠️  HTTPS connection may have issues"
  echo ""
  echo "Troubleshooting steps:"
  echo "1. Verify custom domain is set:"
  echo "   echo \$CUSTOM_DOMAIN"
  echo ""
  echo "2. Check ALB is configured for HTTPS:"
  echo "   bash scripts/monitor-alb.sh -once"
  echo ""
  echo "3. Verify DNS is properly configured:"
  echo "   dig $CUSTOM_DOMAIN"
  echo "   nslookup $CUSTOM_DOMAIN"
  echo ""
  echo "4. Check certificate validation:"
  echo "   aws acm list-certificates --region ap-south-1"
fi

echo ""
