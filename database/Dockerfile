FROM postgres:11.2-alpine

# Add tools needed to fetch from config service and parse JSON
RUN apk --no-cache add curl && \
    apk --no-cache add jq

COPY scripts/ /docker-entrypoint-initdb.d

USER postgres