# TradeTicker - Test Checklist

## Authentication

- [x] Login works with valid credentials
- [x] Invalid credentials return an error
- [x] Authentication uses HttpOnly cookies
- [x] `GET /api/auth/me` returns the authenticated user
- [x] Expired access token can be refreshed
- [x] Original request succeeds after token refresh
- [x] Protected pages require authentication

## Trades Page

- [x] Trades load successfully
- [x] Loading state works
- [x] Pagination works
- [x] Sorting works
- [x] Symbol filter works
- [x] Side filter works
- [x] Status filter works
- [x] Book filter works
- [x] Counterparty filter works
- [x] Grid is responsive
- [x] Grid uses available width on large screens

## Create Trade

- [x] Create Trade dialog opens
- [x] Trade can be created
- [x] Validation works
- [x] New trade appears in the grid
- [x] `TRADE_CREATED` WebSocket event is received
- [x] Trades cache updates
- [x] Trade summary updates

## Update Trade

- [x] Actions menu opens
- [x] ACTIVE trade can be edited
- [x] Update dialog opens
- [x] Trade can be updated
- [x] Updated trade appears in the grid
- [x] `TRADE_UPDATED` WebSocket event is received
- [x] Trades cache updates
- [x] Trade summary updates

## Cancel Trade

- [x] ACTIVE trade can be cancelled
- [x] Confirmation dialog opens
- [x] Cancel request works
- [x] Trade status changes to `CANCELLED`
- [x] `TRADE_CANCELLED` WebSocket event is received
- [x] Cancelled trade cannot be edited
- [x] Cancelled trade cannot be closed
- [x] Trade summary updates

## Close Trade

- [x] ACTIVE trade can be closed
- [x] Confirmation dialog opens
- [x] Close request works
- [x] Trade status changes to `CLOSED`
- [x] `TRADE_CLOSED` WebSocket event is received
- [x] Closed trade cannot be edited
- [x] Closed trade cannot be cancelled
- [x] Trade summary updates

## Trade Grid

- [x] Symbol displays correctly
- [x] BUY side displays correctly
- [x] SELL side displays correctly
- [x] Quantity displays correctly
- [x] Trade price displays correctly
- [x] Market price displays correctly
- [x] ACTIVE status displays as a pill
- [x] CLOSED status displays as a pill
- [x] CANCELLED status displays as a pill
- [x] Trade timestamp displays correctly
- [x] Actions menu works
- [x] Actions menu does not close/remount because of market-price updates

## Individual Trade P&L

- [x] P&L is displayed for ACTIVE trades
- [x] BUY P&L is calculated correctly
- [x] SELL P&L is calculated correctly
- [x] Positive P&L displays in green
- [x] Negative P&L displays in red
- [x] P&L updates when market price changes

## Live Market Prices

- [x] WebSocket connects successfully
- [x] `MARKET_PRICE_UPDATED` events are received
- [x] Market prices update without refreshing
- [x] Correct symbol is updated
- [x] `previous_price` is retained in the frontend
- [x] Price increase flashes green
- [x] Price decrease flashes red
- [x] Price updates do not interfere with trade actions

## Trade Summary

- [x] Total unrealized P&L displays correctly
- [x] Total market value displays correctly
- [x] Active trade count displays correctly
- [x] Closed trade count displays correctly
- [x] Cancelled trade count displays correctly
- [x] `MARKET_PRICE_SUMMARY_UPDATED` is received
- [x] Total unrealized P&L updates live
- [x] Total market value updates live
- [x] Total P&L flashes green when increasing
- [x] Total P&L flashes red when decreasing
- [x] Market value flashes green when increasing
- [x] Market value flashes red when decreasing

## Aggregate P&L by Symbol

- [x] `GET /api/trades/symbols` works
- [x] P&L page loads successfully
- [x] Trades are aggregated by symbol
- [x] Symbol displays correctly
- [x] Net quantity displays correctly
- [x] Net quantity can be negative for a net short position
- [x] Active trade count displays correctly
- [x] Market price displays correctly
- [x] Total market value displays correctly
- [x] Total unrealized P&L displays correctly
- [x] Positive P&L displays in green
- [x] Negative P&L displays in red
- [x] `AGGREGATED_PNL_UPDATED` WebSocket event is received
- [x] Aggregate P&L updates live
- [x] Market value flashes when its value changes
- [x] Unrealized P&L flashes when its value changes

## Trade History

- [x] Trade History page loads successfully
- [x] Trade history includes related trade details
- [x] History is ordered newest first
- [x] Pagination works
- [x] Trade creation appears in history
- [x] Trade update appears in history
- [x] Trade cancellation appears in history
- [x] Trade close appears in history
- [x] `TRADE_CREATED` invalidates trade history
- [x] `TRADE_UPDATED` invalidates trade history
- [x] `TRADE_CANCELLED` invalidates trade history
- [x] `TRADE_CLOSED` invalidates trade history

## Navigation

- [x] Desktop sidebar displays `TradeTicker`
- [x] Trades link works
- [x] P&L link works
- [x] Trade History link works
- [x] Active page is highlighted
- [x] Mobile navigation opens
- [x] Mobile Trades link works
- [x] Mobile P&L link works
- [x] Mobile Trade History link works
- [x] Mobile navigation closes after selecting a page

## Final Smoke Test

- [x] Login
- [x] Open Trades page
- [x] Create a trade
- [x] Edit the trade
- [x] Watch market price update live
- [x] Verify trade P&L updates
- [x] Verify Trade Summary updates
- [x] Open P&L page
- [x] Verify aggregate P&L updates live
- [x] Verify green/red flash effects
- [x] Open Trade History
- [x] Cancel a trade
- [x] Verify cancellation appears in history
- [x] Close a trade
- [x] Verify close appears in history
- [x] Refresh browser and verify authentication still works
