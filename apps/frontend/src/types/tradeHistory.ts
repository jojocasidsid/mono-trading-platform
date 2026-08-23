export type TradeHistoryAction = 'CREATED' | 'UPDATED' | 'CANCELLED' | 'CLOSED';

export interface TradeHistory {
  id: string;
  tradeId: string;
  traderId: string;
  action: TradeHistoryAction;
  createdAt: string;
}

export interface TradeHistoryListParams {
  page?: number;
  perPage?: number;
}

export interface PaginatedTradeHistory {
  data: TradeHistory[];

  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
