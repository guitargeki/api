FROM nginx:1.15-alpine

# Install dependencies
RUN apk --no-cache add curl && \
    apk --no-cache add jq && \
    mkdir app && \
    mkdir app/ssl

WORKDIR /etc/nginx
COPY conf.d/ conf.d

WORKDIR /app
COPY run.sh .

CMD [ "./run.sh" ]