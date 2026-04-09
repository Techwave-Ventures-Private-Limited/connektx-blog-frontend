# Stage 1: Dependencies
FROM node:20.12.2-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* .npmrc* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:20.12.2-alpine AS builder
WORKDIR /app

# Build arguments for environment-specific builds
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_APP_BACKEND_URL
ARG NEXT_PUBLIC_WHATSAPP_URL

# Set build-time environment variables
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_APP_BACKEND_URL=${NEXT_PUBLIC_APP_BACKEND_URL}
ENV NEXT_PUBLIC_WHATSAPP_URL=${NEXT_PUBLIC_WHATSAPP_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20.12.2-alpine AS runner
WORKDIR /app

# Add labels for metadata
LABEL maintainer="connektx-team"
LABEL version="1.0.0"
LABEL description="ConnektX Next.js Web Application"
LABEL org.opencontainers.image.source="https://github.com/your-org/connektx-web"

# Install AWS CLI and jq for AWS Secrets Manager support
RUN apk add --no-cache aws-cli jq

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy entrypoint script
COPY scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check - checks if the /api/health endpoint responds with 200
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["./entrypoint.sh"]
