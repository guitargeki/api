FROM postgres:11.2-alpine

# Install dependencies
RUN apk --no-cache add git && \
    apk --no-cache add curl && \
    apk --no-cache add jq

# Copy crontab file (used to schedule backups)
COPY crontabs /etc/crontabs/root

# Copy the backup script
WORKDIR /
RUN mkdir backup
WORKDIR /backup
COPY backup_db.sh .

# Start cron daemon in the background
CMD ["crond", "-f"]