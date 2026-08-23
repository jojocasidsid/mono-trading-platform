export type TradeSide = 'BUY' | 'SELL';

export type TradeStatus = 'ACTIVE' | 'CANCELLED' | 'CLOSED';

export interface Trade {
  id: string;
  symbol: string;
  side: TradeSide;
  quantity: number;
  price: number;
  traderId: string;
  book: string;
  counterparty: string;
  tradeTimestamp: string;
  status: TradeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TradeListParams {
  page?: number;
  perPage?: number;
  symbol?: string;
  side?: TradeSide;
  status?: TradeStatus;
  book?: string;
  counterparty?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TradeSummary {
  total_unrealized_pnl: number;
  total_market_value: number;
  active_trades: number;
  cancelled_trades: number;
  closed_trades: number;
}

export interface PaginatedTrades {
  data: Trade[];

  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface AggregatedPnl {
  symbol: string;
  market_price: number;
  net_quantity: number;
  active_trades: number;
  total_market_value: number;
  total_unrealized_pnl: number;
}
