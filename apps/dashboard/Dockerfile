ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /app

EXPOSE 7001
RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json ./
COPY yarn.lock .yarnrc.yml ./
COPY apps/dashboard/package.json ./apps/dashboard/
RUN yarn install

# Development stage
FROM deps AS development
WORKDIR /app

COPY . .
CMD ["yarn", "dev"]

# Production stage
FROM deps AS production
WORKDIR /app

COPY . .
RUN yarn turbo run build --filter=@mds/dashboard

CMD ["yarn", "turbo", "run", "start", "--filter=@mds/dashboard"]