# ConnektX Web Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Table of Contents
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [AWS Secrets Manager Integration](#aws-secrets-manager-integration)
- [Learn More](#learn-more)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

This application uses environment variables for configuration. Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### Required Environment Variables

#### Build-Time Variables (Public - embedded in browser bundle)
- `NEXT_PUBLIC_SITE_URL` - Your site's public URL (e.g., https://connektx.com)
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL for blog operations
- `NEXT_PUBLIC_APP_BACKEND_URL` - Backend API URL for social/networking features
- `NEXT_PUBLIC_WHATSAPP_URL` - WhatsApp group invitation link

#### Runtime Variables (Server-Side Only - NOT exposed to browser)
- `GEMINI_API_KEY` - Google Gemini API key for AI-powered excerpt generation (⚠️ CRITICAL: Do NOT prefix with NEXT_PUBLIC_)

#### Optional Variables (AWS Deployment)
- `AWS_SECRET_ARN` - ARN of AWS Secrets Manager secret (for production deployments)
- `AWS_REGION` - AWS region where secrets are stored
- `AWS_ACCESS_KEY_ID` - AWS credentials (if not using IAM roles)
- `AWS_SECRET_ACCESS_KEY` - AWS credentials (if not using IAM roles)

### Security Notes

🔒 **IMPORTANT**: The `GEMINI_API_KEY` must NOT have the `NEXT_PUBLIC_` prefix. Variables with `NEXT_PUBLIC_` are embedded in the browser bundle and are publicly accessible. Server-side secrets should never be exposed to the browser.

After updating your environment variables, remember to:
1. Rotate the Gemini API key if it was previously exposed
2. Never commit `.env` files to version control (already in `.gitignore`)
3. Use AWS Secrets Manager or similar for production deployments

## Docker Deployment

This application is containerized using Docker with multi-stage builds for optimal production performance.

### Quick Start with Docker

#### 1. Build the Docker image

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://connektx.com \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://your-backend.com/api \
  --build-arg NEXT_PUBLIC_APP_BACKEND_URL=https://your-social-backend.com \
  --build-arg NEXT_PUBLIC_WHATSAPP_URL=https://chat.whatsapp.com/YOUR_GROUP_ID \
  -t connektx-web:latest .
```

#### 2. Run the container

```bash
docker run -d \
  --name connektx-web \
  -p 3000:3000 \
  -e GEMINI_API_KEY=your_gemini_api_key_here \
  connektx-web:latest
```

#### 3. Access the application

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Docker Compose (Recommended for Local Development)

```bash
# Set your Gemini API key in your shell
export GEMINI_API_KEY=your_gemini_api_key_here

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Docker Features

#### Multi-Stage Build
The Dockerfile uses a 3-stage build process:
1. **deps** - Installs Node.js dependencies
2. **builder** - Builds the Next.js application with environment-specific variables
3. **runner** - Minimal production image with only runtime dependencies

#### Security Features
- ✅ Runs as non-root user (`nextjs`)
- ✅ Minimal Alpine Linux base image
- ✅ Specific Node.js version pinned (20.12.2)
- ✅ `.dockerignore` prevents copying sensitive files
- ✅ Health check endpoint at `/api/health`

#### Health Check

The container includes an automatic health check that pings `/api/health` every 30 seconds:

```bash
# Check container health status
docker inspect --format='{{json .State.Health}}' connektx-web

# View health check logs
docker logs connektx-web 2>&1 | grep health
```

### Environment-Specific Builds

Build different configurations for dev, staging, and production:

#### Development
```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  --build-arg NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api \
  -t connektx-web:dev .
```

#### Production
```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://connektx.com \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.connektx.com \
  -t connektx-web:prod .
```

## AWS Secrets Manager Integration

For production deployments on AWS (ECS, EC2, Fargate), the application supports automatic secret retrieval from AWS Secrets Manager.

### Setup AWS Secrets Manager

#### 1. Create a secret in AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name connektx-web-secrets \
  --description "ConnektX web application secrets" \
  --secret-string '{"GEMINI_API_KEY":"your_actual_api_key_here"}' \
  --region us-east-1
```

#### 2. Note the ARN of the created secret

```bash
aws secretsmanager describe-secret \
  --secret-id connektx-web-secrets \
  --region us-east-1 \
  --query ARN \
  --output text
```

#### 3. Run the container with AWS credentials

```bash
docker run -d \
  --name connektx-web \
  -p 3000:3000 \
  -e AWS_SECRET_ARN=arn:aws:secretsmanager:us-east-1:123456789012:secret:connektx-web-secrets-AbCdEf \
  -e AWS_REGION=us-east-1 \
  -e AWS_ACCESS_KEY_ID=your_access_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret_key \
  connektx-web:latest
```

**Note**: On AWS ECS/Fargate, use IAM task roles instead of passing credentials directly.

### AWS ECS Task Definition Example

```json
{
  "family": "connektx-web",
  "taskRoleArn": "arn:aws:iam::123456789012:role/connektx-web-task-role",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "connektx-web:latest",
      "portMappings": [{"containerPort": 3000}],
      "environment": [
        {"name": "AWS_SECRET_ARN", "value": "arn:aws:secretsmanager:us-east-1:123456789012:secret:connektx-web-secrets"},
        {"name": "AWS_REGION", "value": "us-east-1"}
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})\""],
        "interval": 30,
        "timeout": 3,
        "retries": 3,
        "startPeriod": 40
      }
    }
  ]
}
```

### Required IAM Permissions

The ECS task role needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:connektx-web-secrets*"
    }
  ]
}
```

### How It Works

1. Container starts and runs `entrypoint.sh`
2. Script checks for `AWS_SECRET_ARN` environment variable
3. If present, fetches secret from AWS Secrets Manager using AWS CLI
4. Parses JSON secret and exports as environment variables
5. Starts the Next.js server with loaded secrets

### Troubleshooting

```bash
# Check container logs for secret loading
docker logs connektx-web

# Verify secrets were loaded
docker exec connektx-web env | grep GEMINI_API_KEY

# Test health endpoint
curl http://localhost:3000/api/health
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
