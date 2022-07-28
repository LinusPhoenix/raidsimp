FROM node:16 AS builder
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .
COPY .env.build .env
RUN npm run build

FROM caddy:2
ARG RAIDSIMP_VERSION
ENV RAIDSIMP_VERSION ${RAIDSIMP_VERSION}
COPY --from=builder /app/build /srv
COPY ./caddy/Caddyfile /etc/caddy/Caddyfile