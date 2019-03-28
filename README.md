# Compose

`docker-compose.yml` is for building and testing production images.

`docker-compose.dev.yml` is for building and testing images locally.

`docker-compose.prod.yml` is for running the production images on the production server.

# Useful Commands

## Access container using shell

```
docker exec -it <container name> /bin/sh
```

## Live logging

```
docker logs -f <container name>
```