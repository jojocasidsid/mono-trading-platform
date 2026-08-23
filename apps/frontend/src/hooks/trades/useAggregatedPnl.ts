import { useQuery } from '@tanstack/react-query';

import { getAggregatedPnl } from '@/api/tradeApi';

import { queryKeys } from '@/lib/queryKeys';

export default function useAggregatedPnl() {
  return useQuery({
    queryKey: queryKeys.trades.symbols(),

    queryFn: getAggregatedPnl,

    staleTime: Infinity,
  });
}
