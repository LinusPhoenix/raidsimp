# Build the app
FROM node:16-alpine AS builder
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .
COPY .env.build .env
RUN npm run build

# Install production node_modules
FROM node:16-alpine as modules-installer
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --omit=dev

# Put things together
FROM node:16-alpine
ARG RAIDSIMP_VERSION
ENV RAIDSIMP_VERSION ${RAIDSIMP_VERSION}
ENV NODE_ENV=production
WORKDIR /app
COPY --from=modules-installer /app/node_modules ./node_modules
COPY --from=builder /app/dist ./
COPY .env.build .env
EXPOSE 3000
CMD ["node", "src/main.js"]