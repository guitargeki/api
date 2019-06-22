# Guitargeki API Back End

This is the repository for the Guitargeki API back end. You can read more about the project on the [About](./docs/About.md) page.

## Local Development

To run this project, you will need:

 - Docker
 - Docker Compose

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

### Copy Production Data

Production data is regularly backed up to a Git repository which you can use for local development.

First, `cd` into the `database` folder and create a `scripts` folder. Afterwards, clone the repository using:

```
git clone --depth 1 <insert repo> scripts
```

This will clone the repo into `database/scripts`. The database's Dockerfile will copy files in this folder into the database image.

When the database container starts, it will execute the restore script if the database doesn't already contain data. If it does have existing data, you can remove it using `docker volume rm geki-data`.

If you receive a `bad interpreter: No such file or directory` error, make sure the init script uses LF line endings.

### Start Project

To start the project, use the following:

```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

## Production

### Set Up

First, you will need to set up the production server. Create a new server with your VPS provider and then SSH into it. 

Next, install [Docker CE for Debian](https://docs.docker.com/install/linux/docker-ce/debian/).

Since this project uses GitLab for CI/CD, you will need to set up a GitLab Runner. For this project, [set up the runner in a container](https://docs.gitlab.com/runner/install/docker.html). Use `gitlab/gitlab-runner:alpine` instead of `gitlab/gitlab-runner:latest` for a smaller image size. If you are testing deployments locally, set the project name for the runner's Docker Compose to be different from the app's project name. This will ensure that the deployment script does not incorrectly identify the runner container as an orphan and remove it.

The next step is to register the runner. For this project, we will use the [Docker executor with socket binding](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-docker-socket-binding). The key here is to have the `/var/run/docker.sock:/var/run/docker.sock` in the config file so that containers are created using the host's Docker daemon.

>**Note:** This set up will also work for testing deployments locally (even on Windows machines).

Finally, make sure the following variables are set in the GitLab CI/CD options:

 - COMPOSE_PROJECT_NAME=geki
 - CONFIGS_URL
 - CONFIGS_PASSWORD

You can also optionally choose to reset the database's data to the latest backup. To do this, set a RESET_DATA variable (in the config database, not Gitlab) to 'true' (without quotes).

### Restrict Incoming IPs

Since the server will be sitting behind Cloudflare, you will need to allow Cloudflare's IPs through. This also ensures that the server can *only* be accessed through Cloudflare's servers.

To do this, create a firewall at the VPS level or at the server level if the VPS provider does not have a firewall service. Next, allow [Cloudflare's IPs](https://www.cloudflare.com/ips/) through the firewall.

### Deploy to Staging/Production

It's a good idea to deploy to a staging server first to make sure everything works. Create a staging server by following the same steps outlined in the **Set Up** section. Afterwards, push your changes to the remote **develop** branch and then execute the job manually in GitLab.

If the job failed, make your fixes, push and execute the job again. If the job succeeded, go to the staging website and make sure everything is working.

Once you have verified everything is working correctly, switch to the **production** branch and merge in the **develop** branch. Next, push to the remote and manually start the deployment job.

Finally, merge **production** into **master**.

### Fix Bugs

If bugs come up after you have deployed to production, create a branch off the **production** branch and make your fixes. Afterwards, merge the bugfix branch back into **production** and deploy.

Once you have verified everything is working, merge **production** into **master** and **develop**.