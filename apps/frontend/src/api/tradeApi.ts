import type { CreateTradeRequest, UpdateTradeRequest } from '@fusion/shared';

import type {
  AggregatedPnl,
  PaginatedTrades,
  Trade,
  TradeListParams,
  TradeSummary,
} from '@/types/trade';

import { apiClient } from './apiClient';

export async function listTrades(params: TradeListParams): Promise<PaginatedTrades> {
  const response = await apiClient.get<PaginatedTrades>('/api/trades', {
    params: {
      page: params.page,
      per_page: params.perPage,
      symbol: params.symbol,
      side: params.side,
      status: params.status,
      book: params.book,
      counterparty: params.counterparty,
      sort_by: params.sortBy,
      sort_order: params.sortOrder,
    },
  });

  return response.data;
}

export async function getTradeSummary(): Promise<TradeSummary> {
  const response = await apiClient.get<{
    data: TradeSummary;
  }>('/api/trades/summary');

  return response.data.data;
}

export async function getAggregatedPnl(): Promise<AggregatedPnl[]> {
  const response = await apiClient.get<{
    data: AggregatedPnl[];
  }>('/api/trades/symbols');

  return response.data.data;
}

export async function createTrade(input: CreateTradeRequest): Promise<Trade> {
  const response = await apiClient.post<{
    data: Trade;
  }>('/api/trades', input);

  return response.data.data;
}

export async function updateTrade(tradeId: string, input: UpdateTradeRequest): Promise<Trade> {
  const response = await apiClient.patch<{
    data: Trade;
  }>(`/api/trades/${tradeId}`, input);

  return response.data.data;
}

export async function cancelTrade(tradeId: string): Promise<Trade> {
  const response = await apiClient.post<{
    data: Trade;
  }>(`/api/trades/${tradeId}/cancel`);

  return response.data.data;
}

export async function closeTrade(tradeId: string): Promise<Trade> {
  const response = await apiClient.post<{
    data: Trade;
  }>(`/api/trades/${tradeId}/close`);

  return response.data.data;
}
