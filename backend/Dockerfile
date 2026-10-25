# syntax=docker/dockerfile:1
FROM node:22.23.4-alpine AS deps
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:22.23.4-alpine AS builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
COPY .env.build .env
RUN npm run build

FROM node:22.23.4-alpine
ARG RAIDSIMP_VERSION
ENV RAIDSIMP_VERSION=${RAIDSIMP_VERSION}
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json /app/.env ./
# The database lives in a volume (see docker-compose.yml), this only makes the directory writable.
RUN mkdir sqlite && chown node:node sqlite
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
    CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1
# Run node directly, so that it receives SIGTERM and shuts down cleanly.
CMD ["node", "dist/src/main"]
