````md
# Fusion TradeTicker

A full-stack trading platform demo built with:

- React + Vite
- Fastify
- Prisma
- PostgreSQL
- WebSockets
- React Query
- AG Grid
- shadcn/ui
- Tailwind CSS
- Docker Compose
- pnpm workspaces

---

# Prerequisites

Install the following:

- Docker Desktop or OrbStack
- Docker Compose
- Git
- Node.js 24+
- pnpm 11+

Check your installed versions:

```bash
node --version
pnpm --version
docker --version
docker compose version
```
````

If pnpm is not installed:

```bash
corepack enable
```

or:

```bash
npm install -g pnpm
```

---

# Install Dependencies

This project uses a pnpm monorepo.

Install all dependencies from the project root:

```bash
pnpm install
```

The workspace contains:

```text
apps/frontend
apps/backend
packages/shared
```

---

# Start the Application

Build and start all services:

```bash
docker compose up --build
```

For subsequent runs:

```bash
docker compose up
```

Run in detached mode:

```bash
docker compose up -d
```

This starts:

| Service       | URL                                                          |
| ------------- | ------------------------------------------------------------ |
| Frontend      | [http://localhost:5173](http://localhost:5173)               |
| Backend API   | [http://localhost:3000](http://localhost:3000)               |
| Health Check  | [http://localhost:3000/health](http://localhost:3000/health) |
| WebSocket     | ws://localhost:3000/ws                                       |
| PostgreSQL    | localhost:5432                                               |
| Prisma Studio | [http://localhost:5555](http://localhost:5555)               |

---

# Infrastructure

The following services are started through Docker Compose:

- PostgreSQL
- Backend
- Frontend

WebSockets run inside the Fastify backend and do not require a separate Docker service.

Simulated stock prices are currently stored in backend memory and updated every 5 seconds.

---

# Running Prisma Migrations

The Prisma schema is located at:

```text
apps/backend/prisma/schema.prisma
```

Whenever you modify the Prisma schema, create a migration.

Example:

```bash
docker compose exec backend \
  pnpm exec prisma migrate dev --name add_trade_history
```

For the initial migration:

```bash
docker compose exec backend \
  pnpm exec prisma migrate dev --name initial_schema
```

To apply existing migrations in development:

```bash
docker compose exec backend \
  pnpm exec prisma migrate dev
```

For unapplied migrations in a deployment environment:

```bash
docker compose exec backend \
  pnpm exec prisma migrate deploy
```

---

# Regenerate Prisma Client

Prisma normally regenerates the client automatically after migrations.

If needed, run:

```bash
docker compose exec backend \
  pnpm exec prisma generate
```

Generated Prisma files are located at:

```text
apps/backend/src/generated/prisma
```

---

# Seed the Database

The Prisma seed is configured in:

```text
apps/backend/prisma.config.ts
```

The seed command should be configured as:

```ts
migrations: {
  path: 'prisma/migrations',
  seed: 'tsx prisma/seed.ts',
},
```

Run the database seeder:

```bash
docker compose exec backend \
  pnpm exec prisma db seed
```

The seeder creates:

- Development users
- Trader accounts
- Trades
- Trade history
- ACTIVE trades
- CANCELLED trades
- CLOSED trades
- Randomized execution prices

Development login credentials are printed after the seed completes.

Stock seed data is located at:

```text
apps/backend/prisma/seed-data/stocks.ts
```

User seed data is located at:

```text
apps/backend/prisma/seed-data/users.ts
```

---

# Open Prisma Studio

Prisma Studio is not started automatically.

Run:

```bash
docker compose exec backend \
  pnpm exec prisma studio --port 5555 --browser none
```

Open:

```text
http://localhost:5555
```

---

# Reset the Database

This drops the development database, reapplies migrations, and runs the configured seed.

```bash
docker compose exec backend \
  pnpm exec prisma migrate reset
```

Prisma will ask for confirmation.

To skip confirmation:

```bash
docker compose exec backend \
  pnpm exec prisma migrate reset --force
```

---

# Manually Clear Development Data

Because trade history references trades, and trades reference users, deletion order matters.

You can clear the main tables with:

```sql
TRUNCATE TABLE
  trade_histories,
  trades,
  users
CASCADE;
```

Then reseed:

```bash
docker compose exec backend \
  pnpm exec prisma db seed
```

Only use destructive commands against your local development database.

---

# Check Migration Status

```bash
docker compose exec backend \
  pnpm exec prisma migrate status
```

---

# Backend Logs

```bash
docker compose logs -f backend
```

---

# Frontend Logs

```bash
docker compose logs -f frontend
```

---

# Restart a Single Service

Backend:

```bash
docker compose restart backend
```

Frontend:

```bash
docker compose restart frontend
```

PostgreSQL:

```bash
docker compose restart postgres
```

---

# Stop Everything

```bash
docker compose down
```

---

# Stop Everything and Remove Volumes

This removes PostgreSQL development data.

```bash
docker compose down -v
```

You will need to rerun migrations and the seeder afterwards.

---

# Rebuild Images

Backend:

```bash
docker compose build backend
```

Frontend:

```bash
docker compose build frontend
```

Everything:

```bash
docker compose build
```

Build and immediately start:

```bash
docker compose up --build
```

---

# Backend Shell

Open a shell inside the backend container:

```bash
docker compose exec backend sh
```

---

# Frontend Shell

```bash
docker compose exec frontend sh
```

---

# PostgreSQL Shell

```bash
docker compose exec postgres \
  psql \
  -U fusion \
  -d fusion
```

Useful PostgreSQL command:

```sql
\dt
```

This lists the database tables.

Exit PostgreSQL:

```text
\q
```

---

# Health Check

Verify that the backend is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

# Authentication

The backend supports:

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

Protected requests require:

```http
Authorization: Bearer <access_token>
```

The authenticated trader ID is read from the JWT and is not accepted from the request body.

---

# Trade Endpoints

List trades:

```text
GET /api/trades
```

Supported parameters:

```text
page
per_page
symbol
side
status
book
counterparty
sort_by
sort_order
```

Example:

```text
GET /api/trades?page=1&per_page=20&symbol=AAPL&status=ACTIVE&sort_by=trade_timestamp&sort_order=desc
```

Trade summary:

```text
GET /api/trades/summary
```

Create trade:

```text
POST /api/trades
```

Update trade:

```text
PATCH /api/trades/:id
```

Cancel trade:

```text
POST /api/trades/:id/cancel
```

Close trade:

```text
POST /api/trades/:id/close
```

---

# Trade History

List the authenticated trader's trade history:

```text
GET /api/trade-history
```

Pagination:

```text
GET /api/trade-history?page=1&per_page=20
```

Trade-history actions include:

```text
CREATED
UPDATED
CANCELLED
CLOSED
```

---

# Stocks

List available stocks:

```text
GET /api/stocks
```

This endpoint is used by the create-trade form.

Example response:

```json
{
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc."
    },
    {
      "symbol": "NVDA",
      "name": "NVIDIA Corporation"
    }
  ]
}
```

---

# Stock Prices

Get the current simulated stock prices:

```text
GET /api/stocks/prices
```

Example:

```json
{
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 225.42
    },
    {
      "symbol": "NVDA",
      "name": "NVIDIA Corporation",
      "price": 180.88
    }
  ]
}
```

Stock prices are initialized from:

```text
apps/backend/prisma/seed-data/stocks.ts
```

The backend simulates price changes approximately every 5 seconds.

---

# WebSocket

The WebSocket server runs through the same Fastify backend.

```text
ws://localhost:3000/ws
```

Supported events:

```text
TRADE_CREATED
TRADE_UPDATED
TRADE_CANCELLED
TRADE_CLOSED
MARKET_PRICE_UPDATED
```

Example stock-price event:

```json
{
  "event": "MARKET_PRICE_UPDATED",
  "data": {
    "symbol": "AAPL",
    "price": 225.72,
    "previous_price": 225.42,
    "updated_at": "2026-08-23T03:00:00.000Z"
  }
}
```

Trade events are scoped to the authenticated trader.

Stock-price events are broadcast to authenticated connected clients.

---

# Frontend Dependencies

The frontend uses:

- React
- React Router
- TanStack React Query
- Axios
- AG Grid
- React Hook Form
- Zod
- shadcn/ui
- Tailwind CSS
- Lucide Icons
- Native WebSocket API

# shadcn/ui

Run shadcn commands from:

```bash
cd apps/frontend
```

Initialize shadcn:

```bash
pnpm dlx shadcn@latest init
```

Recommended configuration:

```text
Component Library: Base UI
Preset: Nova
Base Color: Neutral
Icon Library: Lucide
```

Install commonly used components:

```bash
pnpm dlx shadcn@latest add \
  button \
  input \
  label \
  card \
  badge \
  dialog \
  alert-dialog \
  sheet \
  select \
  dropdown-menu \
  skeleton \
  separator \
  tooltip \
  sonner
```

Return to the repository root:

```bash
cd ../..
```

---

# Useful Commands

Install:

```bash
pnpm install
```

Start:

```bash
docker compose up
```

Build and start:

```bash
docker compose up --build
```

PostgreSQL shell:

```bash
docker compose exec postgres \
  psql -U fusion -d fusion
```

Migration:

```bash
docker compose exec backend \
  pnpm exec prisma migrate dev
```

Generate Prisma:

```bash
docker compose exec backend \
  pnpm exec prisma generate
```

Seed:

```bash
docker compose exec backend \
  pnpm exec prisma db seed
```

Migration status:

```bash
docker compose exec backend \
  pnpm exec prisma migrate status
```

Prisma Studio:

```bash
docker compose exec backend \
  pnpm exec prisma studio --port 5555 --browser none
```

Restart backend:

```bash
docker compose restart backend
```

Restart frontend:

```bash
docker compose restart frontend
```

Stop:

```bash
docker compose down
```

Remove local database volume:

```bash
docker compose down -v
```

---

# First-Time Setup

For a fresh clone:

```bash
git clone <repository-url>
cd mono-tradeticker
```

Install dependencies:

```bash
pnpm install
```

Create the root `.env`.

Build and start Docker:

```bash
docker compose up -d --build
```

Apply migrations:

```bash
docker compose exec backend \
  pnpm exec prisma migrate dev
```

Generate Prisma client:

```bash
docker compose exec backend \
  pnpm exec prisma generate
```

Seed the database:

```bash
docker compose exec backend \
  pnpm exec prisma db seed
```

Verify the backend:

```bash
curl http://localhost:3000/health
```

Open the frontend:

```text
http://localhost:5173
```

Optional: open Prisma Studio:

```bash
docker compose exec backend \
  pnpm exec prisma studio --port 5555 --browser none
```

Then visit:

```text
http://localhost:5555
```

---

# Docker Build Troubleshooting

If the Docker build takes an unusually long time while running `pnpm install`, especially while downloading packages from `registry.npmjs.org`, the issue may be caused by network or ISP routing rather than the application.

Try rebuilding:

```bash
docker compose build
```

or:

```bash
docker compose up --build
```

If package downloads continue to time out:

- Restart Docker Desktop or OrbStack.
- Try a mobile hotspot temporarily.
- Change DNS to Cloudflare:
  - `1.1.1.1`
  - `1.0.0.1`

- Or Google:
  - `8.8.8.8`
  - `8.8.4.4`

- Verify that `https://registry.npmjs.org` is reachable.

Once the initial build succeeds, Docker and pnpm should reuse cached dependencies for subsequent builds.

---

# Default Ports

| Service       | Port |
| ------------- | ---: |
| Frontend      | 5173 |
| Backend       | 3000 |
| Prisma Studio | 5555 |
| PostgreSQL    | 5432 |

---

# Architecture

```text
              +--------------------------+
              |        React App         |
              |                          |
              | React Query              |
              | AG Grid                  |
              | shadcn/ui                |
              | Tailwind CSS             |
              +------------+-------------+
                           |
                    REST + WebSocket
                           |
              +------------v-------------+
              |       Fastify API        |
              |                          |
              | Controllers              |
              | Services                 |
              | Repositories             |
              | WebSocket Publishers     |
              +------------+-------------+
                           |
                        Prisma
                           |
              +------------v-------------+
              |       PostgreSQL         |
              |                          |
              | Users                    |
              | Trades                   |
              | Trade History            |
              +--------------------------+

              Backend Memory
                    |
                    |
             Simulated Stock
                 Prices
                    |
                    v
          MARKET_PRICE_UPDATED
                    |
                    v
               WebSocket
```

```

```
