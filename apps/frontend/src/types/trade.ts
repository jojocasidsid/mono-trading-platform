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
  totalUnrealizedPnl: number;
  totalMarketValue: number;
  activeTrades: number;
  cancelledTrades: number;
  closedTrades: number;
}

export interface PaginatedTrades {
  data: Trade[];

  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
