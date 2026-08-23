import { useQuery } from '@tanstack/react-query';

import { listTrades } from '@/api/tradeApi';

import { queryKeys } from '@/lib/queryKeys';

import type { TradeListParams } from '@/types/trade';

export default function useTrades(params: TradeListParams) {
  return useQuery({
    queryKey: queryKeys.trades.list(params),

    queryFn: () => listTrades(params),

    placeholderData: previousData => previousData,
  });
}
