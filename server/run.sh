#!/bin/sh
## Make sure the file has LF line endings!

# Print commands and exit immediately if a command returns a non-zero status
set -e

# Store config so we don't have to re-fetch
echo "Fetching config..."
export CF_CONFIG=$(curl -s -H "Authorization: $CONFIGS_PASSWORD" $CONFIGS_URL/cloudflare/$APP_ENV)

# Set up local variables. -r flag required to remove quotes from values.
export CF_CERTIFICATE=$(echo $CF_CONFIG | jq -r '.CERTIFICATE')
export CF_PRIVATE_KEY=$(echo $CF_CONFIG | jq -r '.PRIVATE_KEY')

# Create certificate and private key files
echo "Creating certificate and private key files..."
echo -e $CF_CERTIFICATE > /app/ssl/cert.pem
echo -e $CF_PRIVATE_KEY > /app/ssl/priv_key.pem

# Start NGINX
echo "Starting NGINX..."
nginx -g "daemon off;"