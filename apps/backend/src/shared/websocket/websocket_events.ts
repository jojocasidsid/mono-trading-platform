export type WebSocketEvent =
  | 'TRADE_CREATED'
  | 'TRADE_UPDATED'
  | 'TRADE_CANCELLED'
  | 'TRADE_CLOSED'
  | 'MARKET_PRICE_UPDATED'
  | 'MARKET_PRICE_SUMMARY_UPDATED'
  | 'AGGREGATED_PNL_UPDATED';

export interface MarketPriceUpdatedEvent {
  symbol: string;
  price: number;
  previous_price: number;
  updated_at: Date;
}

export interface MarketPriceSummaryUpdatedEvent {
  total_unrealized_pnl: number;
  total_market_value: number;
  updated_at: Date;
}

export interface AggregatedPnlUpdatedEvent {
  data: {
    symbol: string;
    market_price: number;
    net_quantity: number;
    active_trades: number;
    total_market_value: number;
    total_unrealized_pnl: number;
  }[];

  updated_at: Date;
}

export interface WebSocketMessage<T> {
  event: WebSocketEvent;
  data: T;
}
