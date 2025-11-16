FROM node:20.19-bullseye-slim AS builder-base

# Use a cache mount for apt to speed up the process
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        openssh-client \
        python3 \
        g++ \
        build-essential \
        git \
        poppler-utils \
        poppler-data \
        procps \
        libcap-dev \
        locales && \
    rm -rf /var/lib/apt/lists/* && \
    sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen en_US.UTF-8

ENV LANG en_US.UTF-8 \
    LANGUAGE en_US:en \
    LC_ALL en_US.UTF-8

RUN yarn config set python /usr/bin/python3
RUN npm install -g bun@1.3.1 pnpm@9.15.0 node-gyp@10.0.1

# install isolated-vm in a parent directory to avoid linking the package in every sandbox
RUN cd /usr/src && bun install isolated-vm@5.0.1

RUN pnpm store add @tsconfig/node18@1.0.0
RUN pnpm store add @types/node@18.17.1
RUN pnpm store add typescript@4.9.4

### STAGE 1: Build ###
FROM builder-base AS build

ENV NX_NO_CLOUD=true \
    NX_NATIVE_RUNTIME=js \
    NX_DAEMON=false

# Set up backend
WORKDIR /usr/src/app

COPY .npmrc package.json bun.lock ./
RUN bun install

COPY . .

RUN npx nx run-many --target=build --projects=react-ui
RUN npx nx run-many --target=build --projects=server-api --configuration production

# Install backend production dependencies
RUN cd dist/packages/server/api && bun install --production

### STAGE 2: Run ###
FROM node:20.19-bullseye-slim AS run

ENV LANG en_US.UTF-8 \
    LANGUAGE en_US:en \
    LC_ALL en_US.UTF-8 \
    NODE_ENV=production \
    NX_DAEMON=false \
    NX_NO_CLOUD=true \
    NX_NATIVE_RUNTIME=js

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    gettext \
    poppler-utils \
    poppler-data \
    procps \
    libcap2 \
    locales && \
    rm -rf /var/lib/apt/lists/* && \
    sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen en_US.UTF-8

# Set up backend
WORKDIR /usr/src/app

COPY packages/server/api/src/assets/default.cf /usr/local/etc/isolate

# Copy Nginx configuration template
COPY nginx.react.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/LICENSE .

RUN mkdir -p /usr/src/app/dist/packages/server/
RUN mkdir -p /usr/src/app/dist/packages/engine/
RUN mkdir -p /usr/src/app/dist/packages/shared/

# Copy Output files to appropriate directory from build stage
COPY --from=build /usr/src/app/dist/packages/engine/ /usr/src/app/dist/packages/engine/
COPY --from=build /usr/src/app/dist/packages/server/ /usr/src/app/dist/packages/server/
COPY --from=build /usr/src/app/dist/packages/shared/ /usr/src/app/dist/packages/shared/

COPY --from=build /usr/src/app/packages packages
# Copy frontend files to Nginx document root directory from build stage
COPY --from=build /usr/src/app/dist/packages/react-ui /usr/share/nginx/html/

LABEL service=activepieces

# Set up entrypoint script
COPY docker-entrypoint.sh .
RUN chmod +x /usr/src/app/docker-entrypoint.sh
ENTRYPOINT ["sh", "/usr/src/app/docker-entrypoint.sh"]

EXPOSE 80