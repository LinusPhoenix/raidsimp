FROM node:16 AS builder
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .
COPY .env.build .env
RUN npm run build

FROM node:16-alpine
ARG RAIDSIMP_VERSION
ENV RAIDSIMP_VERSION ${RAIDSIMP_VERSION}
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]