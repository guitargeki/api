FROM node:8.15-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# This needs to be done before copying the source files to leverage the build cache.
# If the package files are changed in any way (such as adding a new dependency),
# the cache will be invalidated and the dependencies will be redownloaded.
COPY package*.json ./

# Needed for building
COPY tsconfig.json ./

# Install production dependencies. Will only run if the package files were changed.
RUN npm install --production && \
    npm install typescript && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Bundle app source and build. This should be done as late as possible as it will invalidate
# the cache.
COPY src/ src/
RUN npm run build

USER appuser

CMD ["npm", "run", "start"]