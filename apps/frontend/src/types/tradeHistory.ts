import type { Trade } from './trade';

export type TradeHistoryAction = 'CREATED' | 'UPDATED' | 'CANCELLED' | 'CLOSED';

export interface TradeHistory {
  id: string;
  trade_id: string;
  trade: Trade;
  action: TradeHistoryAction;
  created_at: string;
}

export interface TradeHistoryListParams {
  page?: number;
  perPage?: number;
}

export interface PaginatedTradeHistory {
  data: TradeHistory[];

  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
