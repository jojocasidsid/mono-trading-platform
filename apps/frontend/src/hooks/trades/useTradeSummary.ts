import { useQuery } from '@tanstack/react-query';

import { getTradeSummary } from '@/api/tradeApi';

import { queryKeys } from '@/lib/queryKeys';

export default function useTradeSummary() {
  return useQuery({
    queryKey: queryKeys.trades.summary(),

    queryFn: getTradeSummary,
  });
}
