import { useQuery } from '@tanstack/react-query';

import { listStocks } from '@/api/stockApi';

import { queryKeys } from '@/lib/queryKeys';

export default function useStocks() {
  return useQuery({
    queryKey: queryKeys.stocks.list(),

    queryFn: listStocks,

    staleTime: Infinity,
  });
}
