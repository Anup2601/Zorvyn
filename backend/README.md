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
CORS_ORIGINS=http://localhost:3000
```

Production notes:
- Set `CORS_ORIGINS` to your frontend URL(s), comma-separated.
- Example: `CORS_ORIGINS=https://zorvyn-frontend.vercel.app,https://www.zorvyn.com`
- For production cookie auth across domains, keep `NODE_ENV=production` and use HTTPS.

## Deploy to Render with Supabase (Step by Step)

### 1) Create Supabase PostgreSQL connection string

1. Open Supabase project.
2. Go to Database -> Connection string.
3. Copy URI format and use password.
4. Ensure URI includes `sslmode=require`.

Example:

```text
postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
```

### 2) Push code to GitHub

```bash
git add .
git commit -m "prepare backend for production deploy"
git push
```

### 3) Create Render Web Service

1. Render Dashboard -> New -> Web Service.
2. Connect your GitHub repo.
3. Root Directory: `backend`
4. Runtime: `Docker`
5. Branch: your deploy branch (usually `main`).
6. Auto Deploy: ON.

Render will use this Docker startup command from `Dockerfile`:
- `npm run start`

Important:
- Do not set `PORT` manually in Render. Render provides the port value automatically.
- Run migrations separately once after deploy if needed, from Render Shell: `npx prisma migrate deploy`.

### 4) Add Render environment variables

In Render service -> Environment, set:

```env
NODE_ENV=production
DATABASE_URL=<your supabase uri with sslmode=require>
JWT_SECRET=<openssl rand -hex 32 output>
SWAGGER_SERVER_URL=https://<your-render-service>.onrender.com
CORS_ORIGINS=https://<your-frontend-domain>
```

Optional seed vars (only if you want custom admin seed):

```env
SEED_ADMIN_EMAIL=anup.kumar.admin@example.com
SEED_ADMIN_PASSWORD=Anup@12345
```

### 5) Deploy and verify

1. Trigger deploy in Render.
2. Wait for build + start to pass.
3. Check:
   - `GET /health`
   - `GET /api-docs`
4. Test login and a protected route.

### 6) Seed admin user (one-time)

Use Render Shell for the running service:

```bash
npm run db:seed
```

### 7) Point frontend to Render API

- Frontend API base URL should be:
  `https://<your-render-service>.onrender.com`
- If frontend and backend are different domains, include frontend domain in `CORS_ORIGINS`.

### 8) Common Render + Supabase issues

- `P1000` / auth errors: wrong `DATABASE_URL` password.
- Connection/TLS errors: missing `sslmode=require`.
- 401 with cookies across domains: confirm `NODE_ENV=production` and HTTPS URL in frontend.
- CORS blocked: add exact frontend origin to `CORS_ORIGINS` (no trailing slash).

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
