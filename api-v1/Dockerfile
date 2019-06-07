FROM node:8.15-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# This needs to be done before copying the source files to leverage the build cache.
# If the package files are changed in any way (such as adding a new dependency),
# the cache will be invalidated and the dependencies will be redownloaded.
COPY package*.json ./

# Install production dependencies. Will only run if the package files were changed.
RUN npm install --production

# Bundle app source. This should be done as late as possible as it will invalidate
# the cache.
COPY src/ src/

# Create a group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# This command will wait for the config service to be ready before starting.
COPY wait-for.sh ./
CMD ["./wait-for.sh", "config:3000", "-t", "60", "--", "npm", "run", "start"]