import type { TradeSide, TradeStatus } from '../generated/prisma/enums.js';

export interface CreateTradeModel {
  symbol: string;
  side: TradeSide;
  quantity: number;
  price: number;
  trader_id: string;
  book: string;
  counterparty: string;
  trade_timestamp?: Date;
}

export interface UpdateTradeModel {
  symbol?: string;
  side?: TradeSide;
  quantity?: number;
  price?: number;
  book?: string;
  counterparty?: string;
  trade_timestamp?: Date;
}

export interface CloseTradeModel {
  trade_id: string;
  trader_id: string;
  closing_trade: CreateTradeModel;
}

export type TradeSortField =
  | 'trade_timestamp'
  | 'symbol'
  | 'side'
  | 'quantity'
  | 'price'
  | 'status'
  | 'book'
  | 'counterparty';

export type SortOrder = 'asc' | 'desc';

export interface ListTradesModel {
  page?: number;
  per_page?: number;

  symbol?: string;
  side?: TradeSide;
  status?: TradeStatus;
  book?: string;
  counterparty?: string;

  sort_by?: TradeSortField;
  sort_order?: SortOrder;
}
