ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base
# Create app directory
WORKDIR /app
# Expose the port the app runs on
EXPOSE 9000
# Set up yarn package manager
RUN corepack enable

FROM base AS deps
# Copy app dependencies
COPY package*.json yarn.lock .yarnrc.yml ./
# Install app dependencies
RUN yarn install --frozen-lockfile

# Development stage
FROM deps AS development
# Copy app source code
COPY . .
# Start the app
CMD ["yarn", "dev"]

# Production stage
FROM deps AS production
# Copy app source code
COPY . .
# Build the app
RUN yarn build
# Start the app
CMD ["yarn", "start"]