# Guitargeki API Back End

This is the repository for the Guitargeki API back end. You can read more about the project on the [About](./docs/About.md) page.

## Local Development

To run this project, you will need:

 - Docker
 - Docker Compose
 - Git Bash (or other tool to generate TLS certificates)

Follow the next few sections to start developing locally. You can view development tips on the [Tips](./docs/Tips.md) page. Each service also has its own README that you should read.

 - [API V1](./api-v1/README.md)
 - [Backup](./backup/README.md)
 - [Database](./database/README.md)
 - [Server](./server/README.md)

### Set Up Environment Variables

You will need to provide environment variables that tell each container where to retrieve its config values. To do this, create an `.env` file in the current folder with the following text (replace with the appropriate values):

```
COMPOSE_PROJECT_NAME=geki
CONFIGS_URL=https://example.cloudfunctions.net/configs
CONFIGS_PASSWORD=password_to_access_configs
```

Replace `example` with the appropriate Firebase server and project ID. You can also find the appropriate values by looking at the GitLab CI variables.

### Generate Self-Signed TLS Certificate

If you are developing locally, you will need to provide NGINX with a self-signed certificate.

First, create an `ssl` folder inside the `server/dev` directory. Next, open Git Bash in the `ssl` folder and execute the command below. Go [here](https://scmquest.com/nginx-docker-container-with-https-protocol/) to see what each flag does.


```cmd
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt
```

This will generate `nginx.key` and `nginx.cert` files. The development Docker Compose will automatically place these files inside the NGINX container.

>**Note:** If you are regenerating a key and certificate, it's a good idea to delete the old certificates from your browser.

### Copy Production Data

Production data is regularly backed up to a Git repository which you can use for local development.

First, `cd` into the `database/dev` folder (create it if it doesn't exist) and then clone the repository using:

```
git clone --depth 1 <insert repo> scripts
```

This will clone the repo into `database/dev/scripts`. Docker Compose will automatically copy files in this folder into the database container.

When the database container starts, it will execute the restore script if the database doesn't already contain data. If it does have existing data, you can remove it using `docker volume rm <volume name>`.

If you receive a `bad interpreter: No such file or directory` error, make sure the init script uses LF line endings.

### Start Project

To start the project, use one of the following commands:

```sh
# Development mode. Use for local development.
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Production mode. Use when deploying to a production server.
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Production

### Setting Up

First, you will need to set up the production server. The first step is to install [Docker CE for Debian](https://docs.docker.com/install/linux/docker-ce/debian/).

Since this project uses GitLab for CI/CD, you will need to set up a GitLab Runner. For this project, [set up the runner in a container](https://docs.gitlab.com/runner/install/docker.html). Use `gitlab/gitlab-runner:alpine` instead of `gitlab/gitlab-runner:latest` for a smaller image size.

The next step is to register the runner. For this project, we will use the [Docker executor with socket binding](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-docker-socket-binding).

>**Note:** This set up will also work for testing deployments locally (even on Windows machines).

Finally, make sure the following variables are set in the GitLab CI/CD options:

 - COMPOSE_PROJECT_NAME=geki
 - CONFIGS_URL
 - CONFIGS_PASSWORD

You can also optionally set a RESET_DATA variable set to 'true' (without quotes) to delete the current data and restore from the latest backup.

### Deploying

To deploy, simply push 