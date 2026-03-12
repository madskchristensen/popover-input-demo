# About

This is a demo of a "Popover Input" system, built in React with Chakra UI V2. A simple NestJS backend exists to showcase the functionality using a Postgres database for persistence.

The Next app can easily utilise codegenerated types and a `react-query` client, by invoking the `yarn codegen` script, which utilises `Orval`.

The project contains **3** Docker services: `nest`, `next` and `postgres`, which can be spun up using `Docker Compose`.

`TypeORM` is used for data mapping, configured to `synchronize` on schema changes. `yarn seed` can be ran from the Nest directory, to seed data.

## How to run

1. Run `env:init` from the root directory. This copies `.env.example` -> `.env`. The example `.env` contains sensible variables to run the project with.
2. Run `docker compose up`. Wait for the containers to run.
3. Run `next codegen` to build API types and queries.
4. Run `nest seed` to populate the database.

The project is built around a single data table. Once all containers are running, the table can be found at the index page at `/` (e.g. `http://localhost:3000`).
