#!/bin/sh
## Make sure the file has LF line endings!

set -e

# Script to remove current data and restore from the latest backup.
# Must pass 'true' as the first argument to execute the script.

if [ -n "$1" ]; then
    if [ $1 == "true" ]; then
        # Store config so we don't have to re-fetch
        echo "Fetching config..."
        export BACKUP_CONFIG=$(curl -s -H "Authorization: $CONFIGS_PASSWORD" $CONFIGS_URL/backup/production)

        # Set up local variables. -r flag required to remove quotes from values.
        export GIT_REPO=$(echo $BACKUP_CONFIG | jq -r '.git.REPO')
        export GIT_ACCESS_TOKEN=$(echo $BACKUP_CONFIG | jq -r '.git.ACCESS_TOKEN')

        # Shallow clone the backup repo
        echo "Retrieving backup data..."
        git clone --depth 1 https://$GIT_ACCESS_TOKEN:x-oauth-basic@$GIT_REPO ./database/dev/scripts

        # Delete current data. The '|| true' ensures the job doesn't fail if the volume doesn't exist.
        echo "Deleting current data..."
        docker volume rm geki_geki-data || true
    fi
fi