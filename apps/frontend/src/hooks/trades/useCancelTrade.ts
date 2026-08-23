import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelTrade } from '@/api/tradeApi';

import { queryKeys } from '@/lib/queryKeys';

export default function useCancelTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tradeId: string) => cancelTrade(tradeId),

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
