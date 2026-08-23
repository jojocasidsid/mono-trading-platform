# AI-Assisted Development Report

## Overview

AI-assisted development was used throughout the project to support implementation, debugging, architectural discussions, and documentation.

I remained responsible for defining the application requirements, selecting the technology stack, designing the overall solution, reviewing generated suggestions, testing the implementation, and making the final technical decisions.

AI was primarily used as a development assistant to accelerate implementation and provide alternative approaches when solving specific engineering problems.

---

## AI Tools Used

### ChatGPT

ChatGPT was the primary AI-assisted development tool used during this project.

It was used for:

- Implementation assistance
- Architecture discussions
- Debugging and troubleshooting
- Code review and refactoring suggestions
- TypeScript and React guidance
- Fastify and WebSocket implementation guidance
- React Query integration
- Authentication implementation
- Test planning
- Documentation

### Claude

Claude is generally my preferred AI development tool for coding-related workflows. However, I did not use it significantly during this project because I did not have sufficient usage credits/tokens available at the time.

As a result, ChatGPT was used as the primary AI assistant throughout the development process. Regardless of the AI tool used, generated suggestions were reviewed, tested, and adapted before being incorporated into the application.

# How AI Was Used

## Application Architecture

### Developer Direction

I defined the overall application architecture and selected the primary technologies:

- React and TypeScript for the frontend
- Fastify and TypeScript for the backend
- PostgreSQL with Prisma for persistence
- React Query for server-state management
- AG Grid for tabular trade data
- Native WebSockets for real-time communication
- A monorepo structure with shared TypeScript definitions

### AI Assistance

AI was used to review implementation approaches within this architecture, generate supporting code, and discuss trade-offs where multiple approaches were possible.

### Final Decision

The existing architecture remained developer-driven. AI suggestions were adapted to fit the established project structure rather than restructuring the application around generated recommendations.

---

## Trade Lifecycle

### Developer Direction

I defined the trade lifecycle around the following operations:

- Create trade
- Update trade
- Cancel trade
- Close trade
- View trade history

I also determined that trade mutations should propagate to the frontend in real time.

### AI Assistance

AI assisted with implementing and refining:

- Fastify controllers and routes
- Trade services
- WebSocket event handling
- React Query invalidation
- Frontend trade actions
- TypeScript definitions

### Final Implementation

The trade lifecycle uses explicit events:

- `TRADE_CREATED`
- `TRADE_UPDATED`
- `TRADE_CANCELLED`
- `TRADE_CLOSED`

These events keep the relevant frontend data synchronized after trade operations.

---

## Real-Time Market Prices

### Developer Direction

I designed the application to simulate changing stock prices and distribute those updates to connected clients through WebSockets.

I also identified during testing that WebSocket messages were successfully reaching the browser while the displayed market prices were not updating.

### AI Assistance

AI helped investigate the frontend synchronization problem and review the React Query cache update logic.

### Final Implementation

Market-price changes are published through:

`MARKET_PRICE_UPDATED`

The frontend updates the appropriate React Query cache directly instead of performing an HTTP request for every price movement.

This keeps frequent market updates lightweight while maintaining React Query as the frontend server-state layer.

---

## React Query Integration

### Developer Direction

I chose React Query for managing server-derived frontend state and wanted WebSocket updates to integrate with the same cache rather than introduce a separate state-management mechanism.

I also maintained a centralized query-key structure aligned with the application's API resources.

### AI Assistance

AI assisted with:

- Query invalidation strategies
- Direct cache updates
- Query-key organization
- Synchronizing WebSocket payloads with existing queries

### Final Decision

Trade lifecycle events generally invalidate affected queries because a mutation can affect multiple pieces of trade data.

High-frequency market-price events update cached values directly because the WebSocket payload already contains the required information.

This avoids unnecessary network requests during frequent price updates.

---

## Trade Grid

### Developer Direction

I defined the trade grid requirements, including:

- Sorting
- Pagination
- Filtering
- Responsive layout
- Market prices
- Trade P&L
- Status indicators
- Trade actions

I also identified an interaction issue where the trade actions menu could close while market prices were updating.

### AI Assistance

AI was used to investigate component rendering behavior and suggest ways to isolate interactive components from high-frequency market updates.

### Final Implementation

The trade grid was structured so that live price updates do not unnecessarily interfere with unrelated trade actions.

Trade statuses were also presented as visual pills to make ACTIVE, CLOSED, and CANCELLED states easier to distinguish.

---

## Unrealized P&L

### Developer Direction

I added unrealized P&L to active trades and later expanded the requirement to include an aggregate P&L view grouped by symbol.

### AI Assistance

AI assisted with reviewing the calculation logic and implementing the backend/frontend integration.

### Final Implementation

For BUY positions:

`(market price - execution price) × quantity`

For SELL positions:

`(execution price - market price) × quantity`

The aggregate P&L view groups active trades by symbol and provides information such as:

- Symbol
- Net quantity
- Active trade count
- Current market price
- Market value
- Unrealized P&L

---

## Real-Time Aggregate P&L

### Developer Direction

After implementing aggregate P&L, I decided that the view should respond to market-price movements in real time rather than require polling or manual refreshes.

### AI Assistance

AI assisted with implementing the additional WebSocket publisher and frontend cache synchronization.

### Final Implementation

An aggregate P&L WebSocket event is published when relevant market values change.

The frontend consumes this event and updates the existing React Query data, allowing the P&L view to remain synchronized with market movements.

---

## Dashboard Summary

### Developer Direction

I wanted the dashboard's market-dependent values to update alongside live market prices.

These values include:

- Total unrealized P&L
- Total market value
- Active trade count
- Closed trade count
- Cancelled trade count

### AI Assistance

AI helped extend the market-price update flow so calculated summary information could also be distributed through WebSockets.

### Final Implementation

Market-dependent summary values are updated using:

`MARKET_PRICE_SUMMARY_UPDATED`

The frontend updates its existing summary cache from the WebSocket payload.

---

## Live Price Feedback

### Developer Direction

I wanted users to have subtle visual feedback when live financial values changed without making the interface distracting.

The desired behavior was:

- Green feedback when a value increases
- Red feedback when a value decreases

I also chose to keep previous-value tracking on the frontend where it was only required for presentation.

### AI Assistance

AI assisted with implementing the animation behavior and evaluating approaches for tracking previous values.

### Final Implementation

Subtle change animations were applied to market prices and relevant P&L/market-value displays.

Where previous values were only required for UI behavior, React refs were used rather than extending backend domain models with presentation-specific state.

---

## Authentication

### Developer Direction

I implemented authentication around JWT access and refresh tokens and chose HttpOnly cookies rather than exposing authentication tokens to frontend JavaScript.

I also tested and validated the refresh flow when an authenticated request initially returned `401 Unauthorized`.

### AI Assistance

AI assisted with:

- Fastify authentication integration
- Cookie handling
- Refresh-token flow
- Frontend request behavior
- Debugging authentication-related issues

### Final Implementation

Authentication uses:

- Short-lived access tokens
- Refresh tokens
- HttpOnly cookies
- Protected backend routes
- Automatic session refresh

The frontend does not directly store or manipulate the authentication tokens.

---

## Logout

### Developer Direction

Once HttpOnly cookie authentication was complete, I added a proper logout flow that needed to invalidate the server-controlled authentication cookies.

### AI Assistance

AI assisted with the backend endpoint and frontend integration.

### Final Implementation

Logout is handled through the backend, which clears the authentication cookies. The frontend then clears its authenticated user state and returns the application to an unauthenticated state.

---

## Trade History

### Developer Direction

I implemented a dedicated Trade History view and later expanded the backend query to include related trade information.

I also required trade lifecycle events to refresh the history when relevant changes occur.

### AI Assistance

AI assisted with updating the repository query, frontend types, and React Query invalidation behavior.

### Final Implementation

Trade History presents the recorded trade activity together with relevant trade details and refreshes following trade lifecycle events.

Realized P&L for closed trades was discussed during development but was not implemented and is therefore not represented as a completed feature.

---

# Key Engineering Decisions

## Native WebSockets

Native WebSockets were retained for real-time communication because the application's requirements were primarily server-to-client event distribution and did not require the additional abstraction provided by Socket.IO.

AI assisted with implementation details, while the WebSocket approach was incorporated into the architecture based on the needs of the application.

---

## Direct Cache Updates for High-Frequency Data

Market-price events occur frequently.

Instead of invalidating a query and making another HTTP request for every market movement, the frontend updates the React Query cache directly from the WebSocket payload.

This decision reduces unnecessary network traffic and keeps the UI responsive.

---

## Query Keys Follow API Resources

The frontend query-key hierarchy was kept aligned with the API design.

For example, aggregate P&L is provided through the trades resource:

`GET /api/trades/symbols`

Therefore, its query key remains under the trades namespace rather than introducing a separate top-level P&L namespace.

This was a developer-directed decision made after reviewing an alternative AI suggestion.

---

## UI State Kept Out of Domain Models

Previous values required exclusively for animations were kept on the frontend.

I rejected the idea of extending backend/domain models solely to support presentation effects and instead used frontend mechanisms such as React refs where appropriate.

---

## Database as Source of Truth

Persistent trade state remains authoritative in PostgreSQL.

WebSockets are used to notify clients and synchronize UI state, rather than becoming an alternative source of truth for trade data.

---

# AI Suggestions Accepted, Modified, or Rejected

## Accepted

After review and testing, I incorporated AI assistance for:

- Typed WebSocket payloads
- Centralized React Query keys
- Direct React Query cache updates for frequent market data
- Backend HttpOnly cookie clearing for logout
- P&L calculation implementation
- Fastify route/controller patterns
- Component isolation and memoization strategies
- Test planning using Vitest and Fastify `inject()`

---

## Modified

Several generated implementations were adapted to better match the existing application.

Examples include:

- Adjusting generated controllers and services to use the project's existing repository structure
- Aligning generated frontend hooks with existing query keys
- Modifying WebSocket handlers to distinguish between query invalidation and direct cache updates
- Adjusting AG Grid rendering behavior to work correctly with frequent price changes

---

## Rejected

Some suggestions were intentionally not used.

### Separate P&L Query Namespace

A separate aggregate-P&L query namespace was considered.

I kept the query under the trades namespace because the API endpoint is part of the trades resource.

### Backend Previous-Value State for UI Effects

Adding previous aggregate values to backend models was considered for change animations.

I rejected this because the values were only needed for presentation. Previous-value tracking remained a frontend concern.

### Aggressive Query Refetching

Refetching APIs after every market-price WebSocket message was not used because it would create unnecessary network traffic for data already contained in the WebSocket event.

### Realized P&L in Trade History

Realized P&L was discussed as a possible extension but was not included in the completed implementation.

---

# Prompt Log

The following log summarizes the significant AI interactions rather than reproducing the complete conversational prompts.

| Area                  | Request / Goal                                                              | AI Assistance                                                                | Final Outcome                                                           |
| --------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Trade WebSockets      | Add real-time notifications for trade lifecycle operations                  | Assisted with event types, broadcasting utilities, and frontend handling     | Implemented create, update, cancel, and close trade events              |
| Market Prices         | Distribute simulated market-price movements to the frontend                 | Assisted with provider and WebSocket integration                             | Implemented live market-price updates                                   |
| WebSocket Debugging   | Investigate why received price events were not updating the UI              | Reviewed WebSocket payloads and React Query integration                      | Corrected frontend cache synchronization                                |
| React Query           | Integrate REST data and WebSocket updates through one server-state layer    | Suggested invalidation and direct-update strategies                          | Mutations invalidate relevant data; market prices update cache directly |
| Trade Grid            | Build a responsive grid with live prices, P&L, status, and actions          | Assisted with AG Grid configuration and rendering behavior                   | Implemented responsive trading grid                                     |
| Trade Actions         | Prevent live market updates from disrupting menus/dialogs                   | Assisted with component rendering and memoization approaches                 | Reduced unnecessary action-component recreation                         |
| P&L                   | Calculate unrealized P&L for BUY and SELL trades                            | Reviewed formulas and implementation                                         | Added live P&L to active trades                                         |
| Aggregate P&L         | Implement the required P&L-by-symbol view                                   | Assisted with aggregation service, types, API integration, and frontend view | Added aggregate P&L grouped by symbol                                   |
| Aggregate P&L Updates | Make aggregate values respond to live market prices                         | Assisted with WebSocket publisher and frontend synchronization               | Added real-time aggregate P&L updates                                   |
| Dashboard             | Keep market-dependent summary values synchronized                           | Assisted with summary event implementation                                   | Added live total unrealized P&L and market-value updates                |
| Visual Feedback       | Indicate increases/decreases without distracting the user                   | Assisted with animation implementation                                       | Added subtle green/red change feedback                                  |
| Authentication        | Implement JWT authentication without exposing tokens to frontend JavaScript | Assisted with Fastify, cookies, refresh handling, and debugging              | Implemented HttpOnly cookie authentication                              |
| Logout                | Properly terminate an HttpOnly-cookie session                               | Assisted with backend and frontend implementation                            | Added server-side cookie clearing and frontend logout                   |
| Trade History         | Display historical activity with associated trade information               | Assisted with repository and frontend integration                            | Implemented Trade History view                                          |
| Responsive UI         | Improve usability across desktop and smaller screens                        | Assisted with Tailwind/layout adjustments                                    | Added responsive grid and desktop/mobile navigation                     |
| Testing               | Establish a backend testing strategy                                        | Suggested test structure and Fastify testing approach                        | Selected Vitest and Fastify `inject()` for backend testing              |
| Documentation         | Prepare technical and AI-usage documentation                                | Assisted with organizing and wording documentation                           | Produced project documentation for submission                           |

---

# Development Responsibility

AI was used as an engineering productivity tool throughout the project. It was particularly useful for accelerating implementation, exploring alternatives, and debugging issues after I supplied code, errors, or runtime behavior.

I remained responsible for:

- Defining the product requirements
- Selecting the technology stack
- Directing feature development
- Designing the overall application structure
- Identifying implementation and runtime problems
- Providing project-specific constraints and existing code
- Reviewing generated code
- Testing proposed solutions
- Accepting, modifying, or rejecting AI suggestions
- Integrating changes into the application
- Making final architectural and implementation decisions

The final application represents developer-directed, AI-assisted software development rather than autonomous AI-generated development.
