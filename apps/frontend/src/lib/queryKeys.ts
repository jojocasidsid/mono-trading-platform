import type { TradeListParams } from '@/types/trade';

import type { TradeHistoryListParams } from '@/types/tradeHistory';

export const queryKeys = {
  trades: {
    all: ['trades'] as const,

    lists: () => ['trades', 'list'] as const,

    list: (params: TradeListParams) => ['trades', 'list', params] as const,

    summary: () => ['trades', 'summary'] as const,
  },

  tradeHistory: {
    all: ['trade-history'] as const,

    lists: () => ['trade-history', 'list'] as const,

    list: (params: TradeHistoryListParams) => ['trade-history', 'list', params] as const,
  },

  stocks: {
    all: ['stocks'] as const,

    list: () => ['stocks', 'list'] as const,

    prices: () => ['stocks', 'prices'] as const,
  },
};
