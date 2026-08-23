import type { PaginatedTradeHistory, TradeHistoryListParams } from '@/types/tradeHistory';

import { apiClient } from './apiClient';

export async function listTradeHistory(
  params: TradeHistoryListParams
): Promise<PaginatedTradeHistory> {
  const response = await apiClient.get<PaginatedTradeHistory>('/api/trade-history', {
    params: {
      page: params.page,
      per_page: params.perPage,
    },
  });

  return response.data;
}
