# TradeTicker

TradeTicker is a full-stack trading application for creating, managing, and monitoring trades with real-time market price updates and P&L calculations.

The application provides trade management, trade history, aggregate P&L views, authentication, and real-time updates using WebSockets.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TanStack React Query
- React Router
- AG Grid
- Tailwind CSS
- shadcn/ui
- Native WebSocket API

### Backend

- Node.js
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- Native WebSockets
- JWT authentication
- Vitest

### Project Structure

The application is organized as a pnpm monorepo:

```text
.
├── apps/
│   ├── backend/
│   └── frontend/
├── packages/
│   └── shared/
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

`apps/frontend` contains the React application.

`apps/backend` contains the Fastify API, business logic, persistence layer, authentication, and WebSocket implementation.

`packages/shared` contains types and validation schemas shared between the frontend and backend.

---

# Architecture

## High-Level Architecture

```text
                    ┌──────────────────┐
                    │      React       │
                    │                  │
                    │ React Query      │
                    │ AG Grid          │
                    └────────┬─────────┘
                             │
                    HTTP     │     WebSocket
                             │
                    ┌────────▼─────────┐
                    │     Fastify      │
                    │                  │
                    │ Routes           │
                    │ Controllers      │
                    │ Services         │
                    │ Repositories     │
                    └───────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
       ┌──────▼───────┐           ┌──────▼───────┐
       │  PostgreSQL  │           │ Market Price │
       │   + Prisma   │           │   Provider   │
       └──────────────┘           └──────────────┘
```

The backend uses a layered structure:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

Controllers are responsible for handling HTTP requests and responses.

Services contain application and business logic.

Repositories isolate persistence and Prisma operations from the service layer.

This separation keeps business logic independently testable and prevents controllers from becoming tightly coupled to database implementation details.

---

# Architecture Decisions

## PostgreSQL as the Source of Truth

Persistent trade state is stored in PostgreSQL.

WebSockets are used to notify connected clients about changes but are not treated as an alternative source of truth.

This means clients can reconnect or reload the application and reconstruct the current state from the API.

---

## React Query for Server State

TanStack React Query is used as the primary server-state management layer on the frontend.

HTTP responses populate the React Query cache, while WebSocket events either invalidate or directly update that same cache.

Two different strategies are intentionally used.

### Trade Events

Events such as:

```text
TRADE_CREATED
TRADE_UPDATED
TRADE_CANCELLED
TRADE_CLOSED
```

invalidate affected trade queries.

A trade mutation can affect multiple pieces of information including:

- Trade lists
- Trade history
- Dashboard counts
- Aggregate P&L

Invalidation allows the backend to remain authoritative for these operations.

### Market Price Events

High-frequency market updates are handled differently.

Events such as:

```text
MARKET_PRICE_UPDATED
MARKET_PRICE_SUMMARY_UPDATED
```

update the relevant React Query cache directly.

Performing another HTTP request for every market-price movement would create unnecessary network traffic because the WebSocket message already contains the updated information.

---

## Native WebSockets

Native WebSockets are used rather than Socket.IO.

The real-time requirements of this application are relatively straightforward:

- Publish market-price changes
- Publish trade lifecycle changes
- Publish trader-specific calculated values

The additional abstraction and protocol features provided by Socket.IO were not necessary for the current requirements.

The backend supports both global and trader-specific broadcasting.

Global market-price updates can be sent to all connected clients, while account-specific information such as P&L is restricted to the appropriate trader.

---

## Market Price Simulation

The application uses an internal market-price provider rather than integrating with a live financial market-data provider.

The provider simulates changing stock prices and publishes updates through WebSockets.

A market update contains information such as:

```json
{
  "event": "MARKET_PRICE_UPDATED",
  "data": {
    "symbol": "AAPL",
    "price": 211.25,
    "previous_price": 210.95,
    "updated_at": "2026-08-23T16:17:18.386Z"
  }
}
```

This allows the application to demonstrate real-time behavior without depending on an external market-data API.

---

## P&L Calculation

Unrealized P&L is calculated using the execution price and current simulated market price.

For a BUY trade:

```text
(market_price - execution_price) × quantity
```

For a SELL trade:

```text
(execution_price - market_price) × quantity
```

For example:

```text
BUY 10 AAPL @ $100

Current market price: $110

P&L:
($110 - $100) × 10
= +$100
```

For a SELL trade:

```text
SELL 10 AAPL @ $100

Current market price: $90

P&L:
($100 - $90) × 10
= +$100
```

Only active positions contribute to unrealized P&L.

---

## Aggregate P&L by Symbol

The application also provides an aggregate P&L view grouped by stock symbol.

The aggregate includes:

- Symbol
- Current market price
- Net quantity
- Active trade count
- Total market value
- Total unrealized P&L

Net quantity is calculated as:

```text
BUY quantity - SELL quantity
```

Therefore, a negative net quantity is valid and represents a net short position.

For example:

```text
BUY  5 TSLA
SELL 10 TSLA

Net Quantity = 5 - 10
             = -5
```

P&L is still calculated for each underlying trade according to its BUY or SELL direction before being aggregated.

---

## Authentication

Authentication uses JWT access and refresh tokens stored in HttpOnly cookies.

The frontend does not directly read or store authentication tokens.

The flow is:

```text
Login
  ↓
Backend validates credentials
  ↓
Access + Refresh cookies
  ↓
Authenticated requests
  ↓
Access token expires
  ↓
Refresh endpoint
  ↓
New access token
```

Using HttpOnly cookies reduces exposure of authentication tokens to frontend JavaScript.

Logout is handled by the backend, which clears the authentication cookies.

---

# Features

The application currently supports:

- User authentication
- Access and refresh token handling
- Logout
- Protected routes
- Trade creation
- Trade editing
- Trade cancellation
- Trade closing
- Trade filtering
- Trade sorting
- Trade pagination
- Trade history
- Simulated stock prices
- Real-time market-price updates
- Unrealized P&L
- Aggregate P&L by symbol
- Dashboard trade summary
- Real-time P&L updates
- Responsive desktop/mobile navigation
- Visual trade status indicators
- Subtle price movement feedback

Live financial values provide visual feedback when they change:

- Green for an increase
- Red for a decrease

---

# Installation

## Prerequisites

The following are required:

- Node.js
- pnpm
- Docker
- Docker Compose

The project uses pnpm workspaces, so pnpm should be installed before setting up the application.

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

From the repository root:

```bash
pnpm install
```

# Database Setup

Start PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

Run Prisma migrations:

```bash
pnpm --filter backend prisma migrate dev
```

Generate the Prisma client if required:

```bash
pnpm --filter backend prisma generate
```

If the project includes seed data:

```bash
pnpm --filter backend db:seed
```

---

# Running the Application

## Development

From the repository root, run the configured development command:

```bash
pnpm dev
```

Alternatively, the applications can be started separately.

Backend:

```bash
pnpm --filter backend dev
```

Frontend:

```bash
pnpm --filter frontend dev
```

By default, the applications run on:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

PostgreSQL runs on:

```text
localhost:5432
```

---

# API

The main trade endpoints include:

```text
GET    /api/trades
POST   /api/trades
PATCH  /api/trades/:id

POST   /api/trades/:id/cancel
POST   /api/trades/:id/close

GET    /api/trades/summary
GET    /api/trades/symbols
```

Trade history and authentication endpoints are also exposed through their respective API routes.

A Postman collection is included with the project for manually exercising the API.

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

### Run All Backend Tests

From `apps/backend`:

```bash
pnpm test
```

Or from the monorepo root:

```bash
pnpm --filter backend test
```

### Watch Mode

```bash
pnpm --filter backend test:watch
```

### Run Unit Tests Only

```bash
pnpm --filter backend vitest run src/tests/unit
```

### What Is Tested

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

# Assumptions

## Simulated Market Data

The application assumes that simulated market prices are sufficient for demonstrating real-time trading behavior.

The system is not connected to an exchange or production market-data provider.

---

## Trade Execution

Creating a trade represents an immediately executed trade.

The application does not currently model:

- Pending orders
- Order books
- Partial fills
- Exchange execution
- Bid/ask spread
- Slippage
- Brokerage fees

The focus is trade management and real-time position monitoring rather than exchange matching.

---

## SELL Trades

SELL trades are treated as short positions when they exceed BUY quantity.

Therefore, negative net quantity is valid.

```text
BUY  5
SELL 10

Net Quantity = -5
```

---

## Unrealized P&L

Unrealized P&L is calculated only for active trades using the current simulated market price.

Closed and cancelled trades do not contribute to current unrealized P&L.

---

## Market Value

Market value is based on the current market price multiplied by the quantity of the relevant active trades.

The aggregate view represents the combined market exposure of those trades.

---

## Authentication

The application assumes a browser-based client where HttpOnly cookies can be used for authentication.

---

# Trade-offs

## Simulated Prices vs Real Market Data

A simulated provider was chosen instead of a third-party market-data service.

### Benefit

- No external API dependency
- No API keys
- Deterministic application setup
- Easy demonstration of WebSocket behavior

### Trade-off

The prices do not represent actual market conditions.

---

## Native WebSockets vs Socket.IO

Native WebSockets reduce dependencies and are sufficient for the current event model.

### Benefit

- Smaller abstraction layer
- Direct control over connections and events
- No additional client protocol dependency

### Trade-off

Features such as automatic reconnection strategies, rooms, acknowledgements, and fallback transports must be implemented manually if they become necessary.

---

## React Query Cache Updates vs Refetching

Market-price WebSocket events update React Query directly.

### Benefit

This avoids performing an HTTP request for every market-price movement.

### Trade-off

The frontend must correctly maintain synchronization between incoming WebSocket events and cached server data.

Trade lifecycle operations therefore still favor query invalidation where authoritative server state is more important than avoiding an occasional refetch.

---

## In-Memory WebSocket Connections

Connected WebSocket clients are currently managed by the backend process.

### Benefit

The implementation is simple and appropriate for a single-instance demonstration application.

### Trade-off

The connection registry is local to one backend instance.

A horizontally scaled production deployment would require a shared event-distribution mechanism such as Redis Pub/Sub or another message broker so events can reach clients connected to different backend instances.

---

## In-Memory Market Prices

Current simulated prices are maintained by the application rather than persisted to the database.

### Benefit

Frequent market updates do not create unnecessary database writes.

### Trade-off

Market prices reset when the backend restarts.

For this application, PostgreSQL remains the source of truth for trade data, while market prices are intentionally transient.

---

## Real-Time Derived Values

Dashboard and aggregate P&L values are recalculated as market prices change.

### Benefit

The frontend receives ready-to-display calculated information and remains synchronized with market movements.

### Trade-off

Recalculating positions for every price movement would become increasingly expensive with a very large number of users and positions.

A production-scale implementation could use incremental position calculations, caching, streaming infrastructure, or precomputed position state.

---

## Test Coverage

Automated testing currently prioritizes the highest-value custom business logic, particularly P&L calculations, aggregation, and WebSocket routing.

### Benefit

The most error-prone financial and real-time logic receives automated verification first.

### Trade-off

The current test suite is not intended to provide exhaustive end-to-end coverage of every UI and API path.

Additional integration and browser automation tests would be appropriate before production deployment.

---

# Potential Improvements

Given additional development time, the application could be extended with:

- Real market-data provider integration
- Redis-backed WebSocket event distribution
- Horizontal backend scaling
- Additional backend integration tests
- Frontend component tests
- Playwright end-to-end tests
- Realized P&L for closed positions
- More advanced portfolio analytics
- Improved WebSocket reconnection and recovery
- Rate limiting
- Structured observability and metrics
- Containerized production deployment
- CI/CD pipeline

---

# AI-Assisted Development

AI-assisted development was used during implementation for code generation, debugging, architectural discussions, testing guidance, and documentation.

AI-generated suggestions were reviewed and tested before being incorporated into the project. Architectural direction, technology selection, feature requirements, and final implementation decisions remained developer-directed.

A separate AI Usage Report and Prompt Log are included with the submission with additional details about how AI was used during development.

---

# License

This project was developed as a technical assessment and demonstration application.
