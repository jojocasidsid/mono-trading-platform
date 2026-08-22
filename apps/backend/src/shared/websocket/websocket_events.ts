export type WebSocketEvent =
  | 'TRADE_CREATED'
  | 'TRADE_UPDATED'
  | 'TRADE_CANCELLED'
  | 'TRADE_CLOSED'
  | 'MARKET_PRICE_UPDATED'
  | 'POSITION_UPDATED';

export interface MarketPriceUpdatedEvent {
  symbol: string;
  price: number;
  previous_price: number;
  updated_at: Date;
}

export interface WebSocketMessage<T> {
  event: WebSocketEvent;
  data: T;
}
