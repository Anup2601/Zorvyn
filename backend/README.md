# Zorvyn Backend

A TypeScript REST API for financial record management with JWT authentication, RBAC, Prisma, PostgreSQL, and local Swagger docs.

## Overview

This backend supports:
- Auth with JWT (header or cookie)
- Role-based authorization (ADMIN, ANALYST, VIEWER)
- User management for admins
- Financial record CRUD with soft delete
- Dashboard summary and trends
- Swagger documentation for all operations

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT + bcryptjs
- Swagger (swagger-jsdoc + swagger-ui-express)

## Project Structure

```text
backend/
  server.ts
  src/
    app.ts
    config/
      db.ts
      swagger.ts
    controllers/
    middlewares/
    routes/
    utils/
    types/
  prisma/
    schema.prisma
    seed.ts
    migrations/
```

## Environment Variables

Create `.env` in backend root:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:55432/zorvyn?schema=public
JWT_SECRET=change_this_to_a_strong_secret
NODE_ENV=development
```

Optional:

```env
SWAGGER_SERVER_URL=http://localhost:5000
SEED_ADMIN_EMAIL=anup.kumar.admin@example.com
SEED_ADMIN_PASSWORD=Anup@12345
```

## Run Locally

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- API base: http://localhost:5000
- Swagger: http://localhost:5000/api-docs

## Run with Docker (DB only)

PostgreSQL is exposed to host on `55432`.

```bash
docker compose up -d db
```

Then run app locally:

```bash
npm run dev
```

## Run with Docker (App + DB)

```bash
docker compose up -d --build
```

Note: if Docker app is running, it owns port `5000`.

## Seed Data

Default admin seed profile:
- fullName: Anup Kumar
- email: anup.kumar.admin@example.com
- role: ADMIN
- status: ACTIVE

Run:

```bash
npm run db:seed
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users (ADMIN)
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

### Records
- `GET /api/records` (ANALYST, ADMIN) with pagination and filters
- `GET /api/records/:id` (ANALYST, ADMIN)
- `POST /api/records` (ADMIN)
- `PATCH /api/records/:id` (ADMIN)
- `DELETE /api/records/:id` (ADMIN)

### Dashboard (Authenticated)
- `GET /api/dashboard/summary`
- `GET /api/dashboard/trends`

## Pagination and Filters

Supported on `GET /api/records`:
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `type` (`INCOME` or `EXPENSE`)
- `category`
- `from` (ISO date)
- `to` (ISO date)
- `search`

Supported on `GET /api/users`:
- `page` (default: 1)
- `limit` (default: 20, max: 100)

## Swagger Notes

- Swagger is configured for local testing.
- All route operations are documented.
- Request and response examples use an admin profile for testing.

## Troubleshooting

- `P1000 authentication failed`: ensure `DATABASE_URL` matches the running DB instance.
- Port conflict on `5000`: stop Docker app container or change local app port.
- Swagger showing old data: hard refresh browser and restart local dev server.

## Useful Scripts

```bash
npm run dev
npm run start
npm run typecheck
npm run db:seed
```
