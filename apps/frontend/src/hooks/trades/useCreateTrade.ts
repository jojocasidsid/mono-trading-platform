import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateTradeRequest } from '@fusion/shared';

import { createTrade } from '@/api/tradeApi';

import { queryKeys } from '@/lib/queryKeys';

export default function useCreateTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTradeRequest) => createTrade(input),

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
