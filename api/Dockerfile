FROM node:8.15-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3000

# Default command to run if not overridden in docker-compose.yml
CMD ["node", "./src/index.js"]