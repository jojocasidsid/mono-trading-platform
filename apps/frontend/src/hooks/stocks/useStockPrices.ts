import { useQuery } from '@tanstack/react-query';

import { listStockPrices } from '@/api/stockApi';

import { queryKeys } from '@/lib/queryKeys';

export default function useStockPrices() {
  return useQuery({
    queryKey: queryKeys.stocks.prices(),

    queryFn: listStockPrices,

    staleTime: Infinity,
  });
}
