FROM postgres:11.2-alpine

# Install Git so we can push database backups to a repo
RUN apk add --no-cache git
ARG ADMIN_EMAIL
RUN git config --global user.email "$ADMIN_EMAIL"
RUN git config --global user.name "Guitargeki"

# Copy crontab file (used to schedule backups)
COPY crontabs /etc/crontabs/root

# Copy the backup script
RUN mkdir backup
WORKDIR /backup
COPY backup_db.sh .

# Shallow clone the backup repo
ARG BACKUP_REPO
RUN git clone --depth 1 $BACKUP_REPO backup

# Start cron daemon in the background
CMD ["crond", "-f"]