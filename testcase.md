# TradeTicker - Test Checklist

## Authentication

- [ ] Login works with valid credentials
- [ ] Invalid credentials return an error
- [ ] Authentication uses HttpOnly cookies
- [ ] `GET /api/auth/me` returns the authenticated user
- [ ] Expired access token can be refreshed
- [ ] Original request succeeds after token refresh
- [ ] Protected pages require authentication

## Trades Page

- [ ] Trades load successfully
- [ ] Loading state works
- [ ] Pagination works
- [ ] Sorting works
- [ ] Symbol filter works
- [ ] Side filter works
- [ ] Status filter works
- [ ] Book filter works
- [ ] Counterparty filter works
- [ ] Grid is responsive
- [ ] Grid uses available width on large screens

## Create Trade

- [x] Create Trade dialog opens
- [ ] Trade can be created
- [ ] Validation works
- [ ] New trade appears in the grid
- [ ] `TRADE_CREATED` WebSocket event is received
- [ ] Trades cache updates
- [ ] Trade summary updates

## Update Trade

- [ ] Actions menu opens
- [ ] ACTIVE trade can be edited
- [ ] Update dialog opens
- [ ] Trade can be updated
- [ ] Updated trade appears in the grid
- [ ] `TRADE_UPDATED` WebSocket event is received
- [ ] Trades cache updates
- [ ] Trade summary updates

## Cancel Trade

- [ ] ACTIVE trade can be cancelled
- [ ] Confirmation dialog opens
- [ ] Cancel request works
- [ ] Trade status changes to `CANCELLED`
- [ ] `TRADE_CANCELLED` WebSocket event is received
- [ ] Cancelled trade cannot be edited
- [ ] Cancelled trade cannot be closed
- [ ] Trade summary updates

## Close Trade

- [ ] ACTIVE trade can be closed
- [ ] Confirmation dialog opens
- [ ] Close request works
- [ ] Trade status changes to `CLOSED`
- [ ] `TRADE_CLOSED` WebSocket event is received
- [ ] Closed trade cannot be edited
- [ ] Closed trade cannot be cancelled
- [ ] Trade summary updates

## Trade Grid

- [ ] Symbol displays correctly
- [ ] BUY side displays correctly
- [ ] SELL side displays correctly
- [ ] Quantity displays correctly
- [ ] Trade price displays correctly
- [ ] Market price displays correctly
- [ ] ACTIVE status displays as a pill
- [ ] CLOSED status displays as a pill
- [ ] CANCELLED status displays as a pill
- [ ] Trade timestamp displays correctly
- [ ] Actions menu works
- [ ] Actions menu does not close/remount because of market-price updates

## Individual Trade P&L

- [ ] P&L is displayed for ACTIVE trades
- [ ] BUY P&L is calculated correctly
- [ ] SELL P&L is calculated correctly
- [ ] Positive P&L displays in green
- [ ] Negative P&L displays in red
- [ ] P&L updates when market price changes

## Live Market Prices

- [ ] WebSocket connects successfully
- [ ] `MARKET_PRICE_UPDATED` events are received
- [ ] Market prices update without refreshing
- [ ] Correct symbol is updated
- [ ] `previous_price` is retained in the frontend
- [ ] Price increase flashes green
- [ ] Price decrease flashes red
- [ ] Price updates do not interfere with trade actions

## Trade Summary

- [ ] Total unrealized P&L displays correctly
- [ ] Total market value displays correctly
- [ ] Active trade count displays correctly
- [ ] Closed trade count displays correctly
- [ ] Cancelled trade count displays correctly
- [ ] `MARKET_PRICE_SUMMARY_UPDATED` is received
- [ ] Total unrealized P&L updates live
- [ ] Total market value updates live
- [ ] Total P&L flashes green when increasing
- [ ] Total P&L flashes red when decreasing
- [ ] Market value flashes green when increasing
- [ ] Market value flashes red when decreasing

## Aggregate P&L by Symbol

- [ ] `GET /api/trades/symbols` works
- [ ] P&L page loads successfully
- [ ] Trades are aggregated by symbol
- [ ] Symbol displays correctly
- [ ] Net quantity displays correctly
- [ ] Net quantity can be negative for a net short position
- [ ] Active trade count displays correctly
- [ ] Market price displays correctly
- [ ] Total market value displays correctly
- [ ] Total unrealized P&L displays correctly
- [ ] Positive P&L displays in green
- [ ] Negative P&L displays in red
- [ ] `AGGREGATED_PNL_UPDATED` WebSocket event is received
- [ ] Aggregate P&L updates live
- [ ] Market value flashes when its value changes
- [ ] Unrealized P&L flashes when its value changes

## Trade History

- [ ] Trade History page loads successfully
- [ ] Trade history includes related trade details
- [ ] History is ordered newest first
- [ ] Pagination works
- [ ] Trade creation appears in history
- [ ] Trade update appears in history
- [ ] Trade cancellation appears in history
- [ ] Trade close appears in history
- [ ] `TRADE_CREATED` invalidates trade history
- [ ] `TRADE_UPDATED` invalidates trade history
- [ ] `TRADE_CANCELLED` invalidates trade history
- [ ] `TRADE_CLOSED` invalidates trade history

## Navigation

- [ ] Desktop sidebar displays `TradeTicker`
- [ ] Trades link works
- [ ] P&L link works
- [ ] Trade History link works
- [ ] Active page is highlighted
- [ ] Mobile navigation opens
- [ ] Mobile Trades link works
- [ ] Mobile P&L link works
- [ ] Mobile Trade History link works
- [ ] Mobile navigation closes after selecting a page

## Final Smoke Test

- [ ] Login
- [ ] Open Trades page
- [ ] Create a trade
- [ ] Edit the trade
- [ ] Watch market price update live
- [ ] Verify trade P&L updates
- [ ] Verify Trade Summary updates
- [ ] Open P&L page
- [ ] Verify aggregate P&L updates live
- [ ] Verify green/red flash effects
- [ ] Open Trade History
- [ ] Cancel a trade
- [ ] Verify cancellation appears in history
- [ ] Close a trade
- [ ] Verify close appears in history
- [ ] Refresh browser and verify authentication still works
