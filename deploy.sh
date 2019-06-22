#!/bin/sh
## Make sure the file has LF line endings!

set -e

# First argument is the app environment i.e 'staging', 'production' etc.
# If testing locally, remember to use 'export CONFIGS_URL=<url here>' and 'export CONFIGS_PASSWORD=<password>'.
if [ -n "$1" ]; then
    # Install dependencies
    apk --no-cache add git
    apk --no-cache add jq
    apk --no-cache add curl

    # Remove containers (including orphans)
    docker-compose -f docker-compose.yml -f docker-compose.$1.yml down --remove-orphans || true

    # Remove current data and restore from the latest backup.
    export RESET_DATA=$(curl -s -H "Authorization: $CONFIGS_PASSWORD" $CONFIGS_URL/database/$1 | jq -r .RESET_DATA)
    if [ $RESET_DATA == "true" ]; then
        # Store config so we don't have to re-fetch
        echo "Initializing data reset process..."
        echo "Fetching config..."
        export BACKUP_CONFIG=$(curl -s -H "Authorization: $CONFIGS_PASSWORD" $CONFIGS_URL/git-data-backup/$1)

        # Set up local variables. -r flag required to remove quotes from values.
        export GIT_REPO=$(echo $BACKUP_CONFIG | jq -r '.REPO')
        export GIT_ACCESS_TOKEN=$(echo $BACKUP_CONFIG | jq -r '.ACCESS_TOKEN')

        # Shallow clone the backup repo
        echo "Retrieving backup data..."
        git clone --depth 1 https://$GIT_ACCESS_TOKEN:x-oauth-basic@$GIT_REPO ./database/scripts

        # Delete current data
        echo "Deleting current data..."
        docker volume rm geki_geki-data || true
    fi

    # Start containers and remove dangling images and containers
    docker-compose -f docker-compose.yml -f docker-compose.$1.yml up -d --build
    docker system prune -f
else
    echo "Must provide app environment as argument e.g. staging, production etc." >&2
    exit 1
fi