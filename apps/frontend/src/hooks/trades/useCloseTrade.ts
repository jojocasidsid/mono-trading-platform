import { useMutation, useQueryClient } from '@tanstack/react-query';

import { closeTrade } from '@/api/tradeApi';

import { queryKeys } from '@/lib/queryKeys';

export default function useCloseTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tradeId: string) => closeTrade(tradeId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.trades.all,
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.tradeHistory.all,
        }),
      ]);
    },
  });
}
