#!/bin/sh
## Make sure the file has LF line endings!

# Print commands and exit immediately if a command returns a non-zero status
set -e

# Store config so we don't have to re-fetch
echo "Fetching config..."
export BACKUP_CONFIG=$(curl -s -H "Authorization: $CONFIGS_PASSWORD" $CONFIGS_URL/backup/production)

# Set up local variables. -r flag required to remove quotes from values.
export GIT_EMAIL=$(echo $BACKUP_CONFIG | jq -r '.git.EMAIL')
export GIT_NAME=$(echo $BACKUP_CONFIG | jq -r '.git.NAME')
export GIT_REPO=$(echo $BACKUP_CONFIG | jq -r '.git.REPO')
export GIT_ACCESS_TOKEN=$(echo $BACKUP_CONFIG | jq -r '.git.ACCESS_TOKEN')
export PGHOST=$(echo $BACKUP_CONFIG | jq -r '.database.HOST')
export PGPORT=$(echo $BACKUP_CONFIG | jq -r '.database.PORT')
export PGDATABASE=$(echo $BACKUP_CONFIG | jq -r '.database.DATABASE')
export PGUSER=$(echo $BACKUP_CONFIG | jq -r '.database.users.postgres.NAME')
export PGPASSWORD=$(echo $BACKUP_CONFIG | jq -r '.database.users.postgres.PASSWORD')

# Shallow clone the backup repo
cd /backup
git clone --depth 1 https://$GIT_ACCESS_TOKEN:x-oauth-basic@$GIT_REPO backup

# Dump data
cd backup/data
pg_dump $PGDATABASE --format=p --exclude-schema public --verbose --username=$PGUSER > db.sql

# Set up Git credentials
git config user.email "$GIT_EMAIL"
git config user.name "$GIT_NAME"

# Push to remote
git add db.sql
git commit -m "Automated backup"
git push

# Remove folder
cd ../..
rm -rf backup