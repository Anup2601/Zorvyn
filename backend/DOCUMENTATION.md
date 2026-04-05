# Zorvyn Backend - Technical Documentation

## 1. Runtime Architecture

```text
Client
  -> Express API (TypeScript, port 5000)
    -> Middleware chain
      -> Controllers
        -> Prisma Client
          -> PostgreSQL
```

Key runtime modules:
- `server.ts`: process bootstrap and DB connect/startup
- `src/app.ts`: Express app + middleware + route mounting
- `src/config/db.ts`: Prisma adapter and DB lifecycle
- `src/config/swagger.ts`: OpenAPI schema and local Swagger server config

## 2. Authentication and Authorization

### JWT Authentication
- Token issued at login/register
- Token accepted from:
  - `Authorization: Bearer <token>`
  - HTTP-only `token` cookie
- Token expiry: 7 days

### User Status Checks
- Auth middleware validates token
- Loads user from DB
- Blocks inactive accounts (`status != ACTIVE`)

### RBAC
Roles:
- `ADMIN`: full access
- `ANALYST`: read records and dashboards
- `VIEWER`: dashboard access

Route guards are enforced with `requireRoles(...)` after auth middleware.

## 3. Rate Limiting

Configured in `src/middlewares/rateLimiter.ts`:
- Global: 100 requests / 15 minutes
- Auth endpoints: 20 requests / 15 minutes

## 4. Database Model Summary

### User
- `id` UUID PK
- `email` unique
- `fullName`
- `phone` nullable
- `password` hashed
- `role` enum (`VIEWER`, `ANALYST`, `ADMIN`)
- `status` enum (`ACTIVE`, `INACTIVE`)
- `createdAt`, `updatedAt`

### FinancialRecord
- `id` UUID PK
- `amount` decimal(14,2)
- `type` enum (`INCOME`, `EXPENSE`)
- `category`
- `date`
- `notes` nullable
- `deletedAt` nullable (soft delete)
- `createdAt`, `updatedAt`
- `createdById` FK -> User

Indexes:
- `date`
- `type`
- `category`

## 5. API Surface

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
- `GET /api/records` (ANALYST, ADMIN)
- `GET /api/records/:id` (ANALYST, ADMIN)
- `POST /api/records` (ADMIN)
- `PATCH /api/records/:id` (ADMIN)
- `DELETE /api/records/:id` (ADMIN)

### Dashboard
- `GET /api/dashboard/summary` (authenticated)
- `GET /api/dashboard/trends` (authenticated)

## 6. Pagination and Filtering

### Users List
`GET /api/users`
- `page` default 1
- `limit` default 20, max 100

### Records List
`GET /api/records`
- Pagination:
  - `page` default 1
  - `limit` default 20, max 100
- Filters:
  - `type`: `INCOME` or `EXPENSE`
  - `category`
  - `from` and `to` (ISO date)
  - `search` (notes/category)

## 7. Swagger Documentation

Swagger UI:
- `http://localhost:5000/api-docs`

Behavior:
- Configured for local server testing
- All route operations are documented
- Request/response examples include admin testing profile (`Anup Kumar`)
- Reusable response schemas are defined under OpenAPI components

## 8. Seeding

Seed script: `prisma/seed.ts`

Defaults:
- `fullName`: `Zorvyn Owner`
- `email`: `owner@zorvyn.local`
- role: `ADMIN`
- status: `ACTIVE`

Overrides (optional env):
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Run:

```bash
npm run db:seed
```

## 9. Local and Docker Setup

### Local

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

### Docker DB

PostgreSQL host port is `55432`.

```bash
docker compose up -d db
```

Use:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:55432/zorvyn?schema=public
```

## 10. Error Model

Common error response:

```json
{
  "error": "Validation failed",
  "message": "Human-readable details"
}
```

Typical status codes:
- `200` success
- `201` created
- `204` deleted/no-content
- `400` validation/bad request
- `401` unauthorized
- `403` forbidden
- `404` not found
- `409` conflict
- `429` rate limited
- `500` internal error

## 11. Operational Notes

- Use strong `JWT_SECRET` in non-dev environments
- Prefer HTTPS in deployed environments
- Keep migrations committed and apply with `prisma migrate deploy`
- If Swagger appears stale, restart app and hard refresh browser


