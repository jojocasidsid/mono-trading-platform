import type { TradeModel } from '../../generated/prisma/models.js';

import type { ListTradesModel, TradeSortField, SortOrder } from '../../models/trade_model.js';

import TradeRepository from '../../repositories/trade_repository.js';

export interface ListTradesResult {
  data: TradeModel[];

  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export default class ListTradesService {
  constructor(private readonly trade_repository = new TradeRepository()) {}

  async execute(trader_id: string, input: ListTradesModel): Promise<ListTradesResult> {
    const page = Math.max(input.page ?? 1, 1);

    const per_page = Math.min(Math.max(input.per_page ?? 20, 1), 100);

    const sort_by: TradeSortField = input.sort_by ?? 'trade_timestamp';

    const sort_order: SortOrder = input.sort_order ?? 'desc';

    const skip = (page - 1) * per_page;

    const filters = {
      trader_id,

      ...(input.symbol !== undefined && {
        symbol: input.symbol,
      }),

      ...(input.side !== undefined && {
        side: input.side,
      }),

      ...(input.status !== undefined && {
        status: input.status,
      }),

      ...(input.book !== undefined && {
        book: input.book,
      }),

      ...(input.counterparty !== undefined && {
        counterparty: input.counterparty,
      }),
    };

    const [trades, total] = await Promise.all([
      this.trade_repository.list({
        ...filters,
        skip,
        take: per_page,
        sort_by,
        sort_order,
      }),

      this.trade_repository.count(filters),
    ]);
    return {
      data: trades,

      pagination: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page),
      },
    };
  }
}
