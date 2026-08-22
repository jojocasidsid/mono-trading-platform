import { broadcast_to_all } from '../shared/websocket/websocket.js';

import type { MarketPriceUpdatedEvent } from '../shared/websocket/websocket_events.js';

export function publish_market_price_updated(market_price: MarketPriceUpdatedEvent): void {
  broadcast_to_all('MARKET_PRICE_UPDATED', market_price);
}
