#!/bin/sh
set -e

echo "Starting ConnektX Web Application..."

# Check if AWS Secret ARN is provided
if [ -n "$AWS_SECRET_ARN" ]; then
  echo "AWS_SECRET_ARN detected: $AWS_SECRET_ARN"
  echo "Fetching secrets from AWS Secrets Manager..."

  # Fetch secret from AWS Secrets Manager
  SECRET_JSON=$(aws secretsmanager get-secret-value \
    --secret-id "$AWS_SECRET_ARN" \
    --query SecretString \
    --output text 2>&1)

  # Check if the command was successful
  if [ $? -eq 0 ]; then
    echo "Successfully fetched secrets from AWS Secrets Manager"

    # Export each key-value pair as environment variable
    # This handles JSON format like: {"GEMINI_API_KEY": "value", "OTHER_KEY": "value"}
    export $(echo "$SECRET_JSON" | jq -r 'to_entries[] | "\(.key)=\(.value)"')

    echo "Environment variables loaded from AWS Secrets Manager"
  else
    echo "WARNING: Failed to fetch secrets from AWS Secrets Manager"
    echo "Error: $SECRET_JSON"
    echo "Continuing with existing environment variables..."
  fi
else
  echo "No AWS_SECRET_ARN provided. Using environment variables from runtime."
fi

# Verify critical environment variables
if [ -z "$GEMINI_API_KEY" ]; then
  echo "WARNING: GEMINI_API_KEY is not set. AI excerpt generation will not work."
fi

echo "Starting Next.js server..."

# Start the application
exec node server.js
