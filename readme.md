# Installation

## Prerequisites

The following are required:

- Node.js
- pnpm
- Docker
- Docker Compose

The project uses pnpm workspaces.

Install pnpm if required:

```bash
npm install -g pnpm
```

## Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

## Install Dependencies

Install the workspace dependencies from the repository root:

```bash
pnpm install
```

After dependencies have been installed, the application services and development commands are run through Docker.

---

# Running the Application

Build and start all application services:

```bash
docker compose up --build -d
```

To verify that the containers are running:

```bash
docker compose ps
```

To view logs for all services:

```bash
docker compose logs -f
```

To view backend logs:

```bash
docker compose logs -f backend
```

To view frontend logs:

```bash
docker compose logs -f frontend
```

By default, the application is available at:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
PostgreSQL: localhost:5432
```

To stop the application:

```bash
docker compose down
```

To stop the application and remove Docker volumes:

```bash
docker compose down -v
```

> Removing volumes will also remove persisted PostgreSQL data.

---

# Database Setup

PostgreSQL runs inside Docker together with the application.

Start the services first:

```bash
docker compose up --build -d
```

## Prisma Client

Generate the Prisma client inside the backend container:

```bash
docker compose exec backend pnpm prisma generate
```

## Database Migrations

Run Prisma migrations inside the backend container:

```bash
docker compose exec backend pnpm prisma migrate dev
```

## Seed Database

Seed the database inside the backend container:

```bash
docker compose exec backend pnpm db:seed
```

If the database needs to be recreated from scratch:

```bash
docker compose down -v
docker compose up --build -d
docker compose exec backend pnpm prisma migrate dev
docker compose exec backend pnpm db:seed
```

---

# Development Commands

Development commands should be executed inside their corresponding Docker containers.

## Backend

For example:

```bash
docker compose exec backend pnpm <command>
```

## Frontend

For example:

```bash
docker compose exec frontend pnpm <command>
```

This keeps application commands running within the same containerized environment used by the application.

---

# Testing

## Backend Tests

Backend unit tests use Vitest.

Tests are located under:

```text
apps/backend/src/tests/
```

Current unit-test coverage focuses on the application's core custom business logic:

```text
src/tests/
└── unit/
    ├── trade_services/
    │   ├── get_dashboard_service.test.ts
    │   └── get_aggregated_pnl_service.test.ts
    │
    └── websocket/
        └── websocket.test.ts
```

## Run All Backend Tests

Make sure the containers are running:

```bash
docker compose up -d
```

Then run the tests inside the backend container:

```bash
docker compose exec backend pnpm test
```

## Watch Mode

```bash
docker compose exec backend pnpm test:watch
```

## Run Unit Tests Only

```bash
docker compose exec backend pnpm vitest run src/tests/unit
```

## Run a Specific Test File

Dashboard tests:

```bash
docker compose exec backend pnpm vitest run src/tests/unit/trade_services/get_dashboard_service.test.ts
```

Aggregate P&L tests:

```bash
docker compose exec backend pnpm vitest run src/tests/unit/trade_services/get_aggregated_pnl_service.test.ts
```

WebSocket tests:

```bash
docker compose exec backend pnpm vitest run src/tests/unit/websocket/websocket.test.ts
```

## What Is Tested

`GetDashboardService` verifies:

- BUY unrealized P&L
- SELL unrealized P&L
- Profit and loss scenarios
- Total market value
- Trade status counts
- Missing market-price handling
- Empty active-trade handling

`ListTradesPerSymbol` verifies:

- Aggregation by symbol
- Mixed BUY/SELL positions
- Net quantity
- Negative net quantity
- Aggregate market value
- Aggregate unrealized P&L
- Multiple symbols
- Missing market-price handling

WebSocket unit tests verify:

- Trader-specific broadcasting
- Global broadcasting
- Multiple connections for one trader
- Client removal
- Closed/inactive socket handling

---

# Quick Start

For reviewers who want to get the application running quickly:

```bash
# Install workspace dependencies
pnpm install

# Build and start the application
docker compose up --build -d

# Generate Prisma client
docker compose exec backend pnpm prisma generate

# Run database migrations
docker compose exec backend pnpm prisma migrate dev

# Seed the database
docker compose exec backend pnpm db:seed

# Run backend tests
docker compose exec backend pnpm test
```

The application should then be available at:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```
