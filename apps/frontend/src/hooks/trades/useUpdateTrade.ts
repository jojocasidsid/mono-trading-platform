import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateTradeRequest } from '@fusion/shared';

import { updateTrade } from '@/api/tradeApi';

import { queryKeys } from '@/lib/queryKeys';

interface UpdateTradeVariables {
  tradeId: string;
  input: UpdateTradeRequest;
}

export default function useUpdateTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tradeId, input }: UpdateTradeVariables) => updateTrade(tradeId, input),

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
