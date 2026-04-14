# ConnektX Scripts Quick Reference

## 🚀 Quick Start

### First-Time Setup
```bash
# 1. Setup AWS infrastructure (ECS, ALB, etc)
export GEMINI_API_KEY=your_key_here
bash scripts/setup-aws-infrastructure.sh

# 2. Setup GitHub deployment user
bash scripts/create-deployment-user.sh

# 3. Configure HTTPS (interactive)
bash scripts/complete-https-setup.sh
```

---

## 📋 All Available Scripts

| Script | Purpose | When to Use |
|--------|---------|------------|
| **Infrastructure** | | |
| `setup-aws-infrastructure.sh` | Create ECS cluster, ALB, ECR, security groups | First time AWS setup |
| `create-deployment-user.sh` | Create GitHub Actions deployment IAM user | Before CI/CD setup |
| `entrypoint.sh` | Docker entrypoint for fetching secrets | Container startup |
| **HTTPS Setup** | | |
| `setup-acm-certificate.sh` | Request SSL/TLS certificate from ACM | First HTTPS setup |
| `configure-alb-https.sh` | Configure ALB HTTPS listener & HTTP→HTTPS redirect | After certificate issued |
| `setup-dns-route53.sh` | Create Route53 DNS records | After ALB configured |
| `setup-dns-hostinger.sh` | Create DNS records in Hostinger registrar | If using Hostinger |
| `test-https.sh` | Verify HTTPS connectivity & certificate | After DNS propagates |
| **Monitoring** | | |
| `complete-https-setup.sh` | Interactive wizard for full HTTPS setup | Automated HTTPS setup |
| `monitor-alb.sh` | Real-time ALB health & status dashboard | Ongoing monitoring |

---

## 🔧 Common Commands

### Initial Setup
```bash
# 1. Setup AWS infrastructure (required first)
export GEMINI_API_KEY=your_gemini_api_key
export AWS_REGION=ap-south-1
bash scripts/setup-aws-infrastructure.sh

# 2. Create GitHub deployment credentials
bash scripts/create-deployment-user.sh
# Copy the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to GitHub Secrets

# 3. Note the ALB DNS name from setup output
# Format: connektx-web-alb-123456789.ap-south-1.elb.amazonaws.com
```

### Setup HTTPS (Full Process)
```bash
# Interactive wizard (recommended)
bash scripts/complete-https-setup.sh

# Or step-by-step:
export CUSTOM_DOMAIN=yourdomain.com
export AWS_REGION=ap-south-1
bash scripts/setup-acm-certificate.sh
bash scripts/configure-alb-https.sh
bash scripts/setup-dns-route53.sh      # For Route53
# OR
bash scripts/setup-dns-hostinger.sh    # For Hostinger registrar
bash scripts/test-https.sh
```

### Monitor Deployment
```bash
# One-time status
bash scripts/monitor-alb.sh -once

# Real-time monitoring (auto-refresh every 30s)
bash scripts/monitor-alb.sh

# Custom refresh interval (60 seconds)
REFRESH_INTERVAL=60 bash scripts/monitor-alb.sh
```

### Test Connectivity
```bash
# Full HTTPS test
bash scripts/test-https.sh

# Quick curl test
curl -I https://yourdomain.com

# Check certificate validity
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443

# View certificate details
openssl s_client -servername yourdomain.com -connect yourdomain.com:443 -showcerts
```

### Check DNS
```bash
# Route53 records
nslookup yourdomain.com

# Detailed DNS lookup
dig yourdomain.com +short
dig yourdomain.com ANY

# Verify ALB DNS
nslookup connektx-web-alb-*.ap-south-1.elb.amazonaws.com
```

### AWS CLI Commands
```bash
# List certificates
aws acm list-certificates --region ap-south-1

# Check certificate status
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:ap-south-1:123456789:certificate/abc123 \
  --region ap-south-1

# List ALBs
aws elbv2 describe-load-balancers --region ap-south-1

# Check target health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --region ap-south-1

# View Route53 records
aws route53 list-resource-record-sets --hosted-zone-id Z1234567890ABC
```

---

## 🔐 Environment Variables

### Infrastructure Setup
```bash
export GEMINI_API_KEY=your_gemini_api_key        # Required for setup-aws-infrastructure
export AWS_REGION=ap-south-1                     # AWS region
export AWS_ACCOUNT_ID=123456789                  # Auto-detected from AWS CLI
```

### HTTPS Setup
```bash
export CUSTOM_DOMAIN=yourdomain.com              # Your domain name
export AWS_REGION=ap-south-1                     # AWS region
export HOSTED_ZONE_ID=Z1234567890ABC             # Route53 hosted zone (auto-detected)
export ACM_CERTIFICATE_ARN=arn:aws:acm:...      # After certificate created
export ENABLE_WILDCARD=true                      # Include *.yourdomain.com (optional)
```

### Monitoring
```bash
export REFRESH_INTERVAL=30                       # Dashboard refresh interval in seconds
export AWS_REGION=ap-south-1                     # AWS region
```

---

## ⏱️ Timeline

| Step | Time | Notes |
|------|------|-------|
| Request ACM certificate | Immediate | Status: PENDING_VALIDATION |
| DNS validation | 5-30 min | Wait for certificate to issue |
| Configure ALB HTTPS | Immediate | Certificate must be ISSUED |
| Create DNS records | Immediate | New records created |
| DNS propagation | 5-48 hours | Usually 5-30 minutes |
| HTTPS accessible | After DNS propagates | Test with curl |

---

## ✅ Checklist

- [ ] Domain is registered and accessible
- [ ] AWS credentials configured
- [ ] ACM certificate requested
- [ ] DNS validation records added to registrar
- [ ] Certificate status is ISSUED
- [ ] ALB HTTPS listener created
- [ ] Route53 DNS records created
- [ ] Domain resolves to ALB
- [ ] HTTPS connection successful
- [ ] HTTP redirects to HTTPS
- [ ] ECS tasks are healthy

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Certificate PENDING_VALIDATION | Wait 5-30 min after adding DNS records |
| HTTPS connection refused | Verify certificate is ISSUED |
| Domain not resolving | Check Route53 nameservers updated in registrar |
| Mixed content warnings | Update internal links to use HTTPS |
| Certificate chain errors | ALB handles chain automatically |
| 502 Bad Gateway | Check ECS tasks are healthy |

---

## 📞 Verify Status

```bash
# Full status
bash scripts/monitor-alb.sh -once

# Quick status
curl -I http://yourdomain.com
curl -I https://yourdomain.com

# Certificate info
openssl s_client -servername yourdomain.com -connect yourdomain.com:443
```

---

## 💾 Save These Commands

```bash
# Copy to your shell profile (~/.bashrc, ~/.zshrc)
export AWS_REGION=ap-south-1
export CUSTOM_DOMAIN=yourdomain.com
export ACM_CERTIFICATE_ARN=arn:aws:acm:ap-south-1:123456789:certificate/abc123

# Useful aliases
alias https-status='bash scripts/monitor-alb.sh -once'
alias https-test='bash scripts/test-https.sh'
alias https-monitor='bash scripts/monitor-alb.sh'
```

---

## 📚 Documentation

- Infrastructure setup: Run `bash scripts/setup-aws-infrastructure.sh` 
- HTTPS configuration: See `HTTPS_SETUP_GUIDE.md`
- Deployment workflow: Check `.github/workflows/` for CI/CD
- Application setup: See root `README.md`
