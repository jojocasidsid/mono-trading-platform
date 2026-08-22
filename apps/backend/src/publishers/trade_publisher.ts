import type { TradeModel } from '../generated/prisma/models.js';

import { broadcast_to_trader } from '../shared/websocket/websocket.js';

export function publish_trade_created(trade: TradeModel): void {
  broadcast_to_trader(trade.trader_id, 'TRADE_CREATED', trade);
}

export function publish_trade_updated(trade: TradeModel): void {
  broadcast_to_trader(trade.trader_id, 'TRADE_UPDATED', trade);
}

export function publish_trade_cancelled(trade: TradeModel): void {
  broadcast_to_trader(trade.trader_id, 'TRADE_CANCELLED', trade);
}

export function publish_trade_closed(trade: TradeModel): void {
  broadcast_to_trader(trade.trader_id, 'TRADE_CLOSED', trade);
}
