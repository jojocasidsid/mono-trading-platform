import type { TradeHistoryModel } from '../../generated/prisma/models.js';

import TradeHistoryRepository from '../../repositories/trade_history_repository.js';

export interface ListTradeHistoryInput {
  page?: number;
  per_page?: number;
}

export interface ListTradeHistoryResult {
  data: TradeHistoryModel[];

  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export default class ListTradeHistoryService {
  constructor(private readonly trade_history_repository = new TradeHistoryRepository()) {}

  async execute(trader_id: string, input: ListTradeHistoryInput): Promise<ListTradeHistoryResult> {
    const page = Math.max(input.page ?? 1, 1);

    const per_page = Math.min(Math.max(input.per_page ?? 20, 1), 100);

    const skip = (page - 1) * per_page;

    const [history, total] = await Promise.all([
      this.trade_history_repository.list({
        trader_id,
        skip,
        take: per_page,
      }),

      this.trade_history_repository.count(trader_id),
    ]);

    return {
      data: history,

      pagination: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page),
      },
    };
  }
}
