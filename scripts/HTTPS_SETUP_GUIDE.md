# ConnektX HTTPS Setup Guide

Complete guide for setting up HTTPS on your ConnektX application deployed on AWS ECS with ALB.

## Prerequisites

- AWS account with appropriate permissions
- AWS CLI configured with credentials
- Custom domain registered (Route53 or external registrar like Hostinger)
- ConnektX infrastructure already deployed via `setup-aws-infrastructure.sh`

## Architecture Overview

```
Client
  ↓
Internet (HTTPS/TLS)
  ↓
ALB (Application Load Balancer) - Port 443
  ↓
ECS Task 1 (Port 3000)
ECS Task 2 (Port 3000)
```

**Flow:**
1. User connects to `https://yourdomain.com` (HTTPS on port 443)
2. ALB terminates SSL/TLS connection
3. ALB forwards traffic to ECS tasks on port 3000 (HTTP internally)
4. HTTP traffic on port 80 is automatically redirected to HTTPS

## Step-by-Step Setup

### Option 1: Automated Setup (Recommended)

```bash
bash scripts/complete-https-setup.sh
```

This interactive wizard will guide you through:
1. Requesting ACM certificate
2. Validating domain ownership
3. Configuring ALB for HTTPS
4. Setting up DNS records
5. Testing HTTPS connectivity

### Option 2: Manual Step-by-Step

#### Step 1: Request ACM Certificate

```bash
export CUSTOM_DOMAIN=yourdomain.com
export AWS_REGION=ap-south-1
export ENABLE_WILDCARD=true  # Optional: for *.yourdomain.com

bash scripts/setup-acm-certificate.sh
```

**What it does:**
- Creates an SSL/TLS certificate in AWS Certificate Manager
- Generates DNS validation records
- Displays certificate ARN for next steps

**Output:** Certificate ARN (save this!)
```
arn:aws:acm:ap-south-1:123456789:certificate/abcd1234-ef56-7890-abcd-ef1234567890
```

**Validation:**
- You'll receive DNS records to add to your domain registrar
- Add these records to validate domain ownership
- Wait 5-30 minutes for validation to complete
- Certificate status should change from PENDING_VALIDATION to ISSUED

#### Step 2: Configure ALB for HTTPS

Once certificate is ISSUED:

```bash
export ACM_CERTIFICATE_ARN=arn:aws:acm:ap-south-1:123456789:certificate/abcd1234...
export CUSTOM_DOMAIN=yourdomain.com
export AWS_REGION=ap-south-1

bash scripts/configure-alb-https.sh
```

**What it does:**
- Creates HTTPS listener on ALB port 443
- Attaches ACM certificate to listener
- Configures HTTP (port 80) → HTTPS (port 443) redirect
- Updates security groups if needed

#### Step 3: Configure DNS Records

##### Option A: Using Route53 (AWS hosted)

```bash
export CUSTOM_DOMAIN=yourdomain.com
export AWS_REGION=ap-south-1
export HOSTED_ZONE_ID=Z1234567890ABC  # Optional: auto-detected if not provided

bash scripts/setup-dns-route53.sh
```

**What it does:**
- Creates alias A record in Route53
- Points `yourdomain.com` → ALB DNS name
- Alias record has zero latency routing

##### Option B: Using External Registrar (Hostinger, GoDaddy, etc)

```bash
export CUSTOM_DOMAIN=yourdomain.com
export AWS_REGION=ap-south-1

bash scripts/setup-dns-hostinger.sh
```

**What it does:**
- Displays the ALB DNS name
- Shows the CNAME record to create in your registrar
- Provides instructions for manual DNS configuration

**Manual steps if using external registrar:**
1. Log into your domain registrar (Hostinger, GoDaddy, Namecheap, etc)
2. Find DNS settings
3. Create a CNAME record:
   - Name: `yourdomain.com` (or `@` for root)
   - Points to: `connektx-web-alb-123456789.ap-south-1.elb.amazonaws.com`
4. Save and wait 5-48 hours for DNS propagation

#### Step 4: Test HTTPS Connectivity

```bash
bash scripts/test-https.sh
```

**What it does:**
- Verifies DNS resolution
- Tests HTTPS connection
- Validates certificate chain
- Checks certificate expiry
- Tests HTTP → HTTPS redirect

**Expected output:**
```
✓ Domain resolves to ALB
✓ Certificate is valid
✓ HTTPS connection successful
✓ HTTP redirects to HTTPS
```

## Monitoring

### Real-Time Dashboard

```bash
# Auto-refresh every 30 seconds
bash scripts/monitor-alb.sh

# One-time status check
bash scripts/monitor-alb.sh -once

# Custom refresh interval
REFRESH_INTERVAL=60 bash scripts/monitor-alb.sh
```

**Shows:**
- ALB status (active/inactive)
- Target health (healthy/unhealthy)
- Certificate info
- ECS task status
- DNS resolution
- HTTPS connectivity

### Manual Health Checks

```bash
# Check ALB status
aws elbv2 describe-load-balancers \
  --names connektx-web-alb \
  --region ap-south-1 \
  --query "LoadBalancers[0].[State.Code,DNSName]" \
  --output text

# Check target health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:123456789:targetgroup/connektx-web-tg/* \
  --region ap-south-1

# Check certificate status
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:ap-south-1:123456789:certificate/abcd1234 \
  --region ap-south-1 \
  --query "Certificate.[Status,DomainName,NotAfter]"

# Check Route53 records
aws route53 list-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --query "ResourceRecordSets[?Name=='yourdomain.com.']"
```

## Certificate Renewal

AWS ACM automatically handles certificate renewal 90 days before expiry.

**To monitor renewals:**
```bash
# Check certificate expiry
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:ap-south-1:123456789:certificate/abcd1234 \
  --region ap-south-1 \
  --query "Certificate.NotAfter"

# Get renewal status
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:ap-south-1:123456789:certificate/abcd1234 \
  --region ap-south-1 \
  --query "Certificate.[RenewalEligibility,RenewalSummary]"
```

## Troubleshooting

### Certificate Still PENDING_VALIDATION

**Problem:** Certificate status remains PENDING_VALIDATION after 30 minutes

**Solution:**
1. Check DNS records were added correctly to registrar
2. Verify DNS propagation: `dig yourdomain.com TXT`
3. Wait another 30 minutes (validation can take up to 1 hour)
4. If still pending after 1 hour, contact AWS support

### HTTPS Connection Refused

**Problem:** `curl: (7) Failed to connect`

**Solution:**
1. Verify certificate status is ISSUED: `bash scripts/monitor-alb.sh -once`
2. Check ALB HTTPS listener exists: `aws elbv2 describe-listeners --load-balancer-arn <ALB_ARN>`
3. Verify security group allows port 443: `aws ec2 describe-security-groups --group-ids <ALB_SG>`
4. Ensure ALB is active: `aws elbv2 describe-load-balancers --names connektx-web-alb`

### Domain Not Resolving

**Problem:** `nslookup yourdomain.com` returns no records

**Solution:**
1. **For Route53:** Verify nameservers point to Route53: `dig yourdomain.com NS`
2. **For external registrar:** 
   - Verify CNAME record in registrar's DNS settings
   - Wait for DNS propagation (can take 5-48 hours)
   - Use `dig yourdomain.com` to force refresh

### Mixed Content Warnings

**Problem:** Browser shows "insecure content" or mixed content warning

**Solution:**
- Update all internal links to use `https://` instead of `http://`
- Ensure external resources also use HTTPS

### ECS Tasks Unhealthy

**Problem:** ALB shows targets as unhealthy

**Solution:**
1. Check ECS tasks are running: `aws ecs describe-tasks --cluster connektx-web-cluster --tasks <TASK_ARN> --region ap-south-1`
2. Check task logs: `aws logs tail /ecs/connektx-web --follow`
3. Verify application listening on port 3000
4. Verify security group allows ALB → Task communication on port 3000

### 502 Bad Gateway

**Problem:** Getting 502 Bad Gateway error

**Causes and solutions:**
1. **Unhealthy targets:** Check `monitor-alb.sh` output
2. **High latency:** Increase health check timeout in ALB
3. **Application crash:** Check ECS task logs: `aws logs tail /ecs/connektx-web --follow`
4. **Port mismatch:** Verify application listening on port 3000

### High Latency or Timeouts

**Problem:** Requests are slow or timing out

**Solution:**
1. Check ALB health: `bash scripts/monitor-alb.sh -once`
2. Check ECS CPU/memory: `aws ecs describe-services --cluster connektx-web-cluster --services connektx-web-service --region ap-south-1`
3. Verify network latency: `ping yourdomain.com`
4. Check CloudWatch metrics: Monitor ALB latency and request count

## Security Best Practices

### 1. Certificate Management
- ✅ Use AWS Certificate Manager (free, auto-renewal)
- ✅ Enable wildcard certificates if needed (`*.yourdomain.com`)
- ✅ Monitor certificate expiry via CloudWatch

### 2. HTTPS Enforcement
- ✅ Redirect all HTTP traffic to HTTPS (configured by default)
- ✅ Use HSTS headers (add to application)
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```

### 3. Security Groups
- ✅ ALB security group: Allow ports 80, 443 from 0.0.0.0/0
- ✅ Task security group: Allow port 3000 only from ALB security group
- ❌ Never allow direct internet access to tasks

### 4. Access Control
- ✅ Use IAM policies (minimal permissions)
- ✅ Rotate AWS credentials regularly
- ✅ Use separate AWS accounts for prod/staging if possible

### 5. Monitoring
- ✅ Enable ALB access logs to S3
- ✅ Monitor certificate expiry
- ✅ Set up CloudWatch alarms for unhealthy targets
- ✅ Monitor application error rates

## Cost Estimation

| Service | Estimated Cost | Notes |
|---------|-------|-------|
| ALB | ~$16/month | $0.0225/hour + data processing |
| ECS Fargate | ~$10-15/month | 2 tasks × 0.5 CPU × 1GB RAM |
| ACM Certificate | FREE | Automatic renewal |
| Route53 (if used) | $0.50/month | $0.50 per hosted zone |
| **Total** | **~$27-32/month** | Scales with traffic |

## Next Steps

1. ✅ Run `bash scripts/setup-aws-infrastructure.sh` (if not done)
2. ✅ Run `bash scripts/complete-https-setup.sh` or manual steps above
3. ✅ Test: `bash scripts/test-https.sh`
4. ✅ Monitor: `bash scripts/monitor-alb.sh`
5. ✅ Setup CI/CD: Create GitHub Actions deployment user with `bash scripts/create-deployment-user.sh`
6. ✅ Push code: Push to `prod` branch to trigger auto-deployment

## Quick Reference Commands

```bash
# Show all commands
ls -la scripts/

# View certificate status
aws acm describe-certificate --certificate-arn <ARN> --region ap-south-1

# Get ALB DNS name
aws elbv2 describe-load-balancers --names connektx-web-alb --region ap-south-1 \
  --query "LoadBalancers[0].DNSName" --output text

# Check HTTPS connectivity
curl -v https://yourdomain.com

# Monitor real-time
bash scripts/monitor-alb.sh

# Get logs
aws logs tail /ecs/connektx-web --follow
```

## Support & Resources

- **AWS Documentation:** https://docs.aws.amazon.com/acm/
- **ALB Guide:** https://docs.aws.amazon.com/elasticloadbalancing/
- **ECS Guide:** https://docs.aws.amazon.com/ecs/
- **Route53 Guide:** https://docs.aws.amazon.com/route53/
