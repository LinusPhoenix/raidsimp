FROM node:16 AS builder
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM caddy:2
COPY --from=builder /app/build /srv
COPY ./caddy/Caddyfile /etc/caddy/Caddyfile