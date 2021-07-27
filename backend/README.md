# Backend

## Installing dependencies

```bash
$ npm install
```

## Configuring Blizzard API Access

Add your Blizzard API credentials in `.env.template`, then rename it to `.env`.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Update the database schema

After changing any entities, generate a new migration like this:

```bash
npm run build
typeorm migration:generate -n $migrationName
```

To apply migrations to the database:

```bash
npm run build
typeorm migration:run
```

## references

-   [NestJS' OpenAPI](https://docs.nestjs.com/openapi/introduction)
