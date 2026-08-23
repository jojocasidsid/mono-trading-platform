import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { listTradeHistory } from '@/api/tradeHistoryApi';

import { queryKeys } from '@/lib/queryKeys';

import type { TradeHistoryListParams } from '@/types/tradeHistory';

export default function useTradeHistory(params: TradeHistoryListParams) {
  return useQuery({
    queryKey: queryKeys.tradeHistory.list(params),

    queryFn: () => listTradeHistory(params),

    placeholderData: keepPreviousData,
  });
}
