import type { TradeModel } from '../generated/prisma/models.js';

import type { TradeSide, TradeStatus } from '../generated/prisma/enums.js';

import Trade, {
  type CreateTradeModel,
  type TradeSortField,
  type SortOrder,
  type UpdateTradeModel,
} from '../models/trade_model.js';

import { ApplicationRepository } from './application_repository.js';

export interface ListTradesRepositoryInput {
  skip: number;
  take: number;

  trader_id: string;

  symbol?: string;
  side?: TradeSide;
  status?: TradeStatus;
  book?: string;
  counterparty?: string;

  sort_by: TradeSortField;
  sort_order: SortOrder;
}

export interface CountTradesRepositoryInput {
  trader_id: string;

  symbol?: string;
  side?: TradeSide;
  status?: TradeStatus;
  book?: string;
  counterparty?: string;
}

export default class TradeRepository extends ApplicationRepository {
  async find_by_id(id: string): Promise<TradeModel | null> {
    return Trade.findUnique({
      where: {
        id,
      },
    });
  }

  async list(input: ListTradesRepositoryInput): Promise<TradeModel[]> {
    return Trade.findMany({
      where: this.build_where(input),

      skip: input.skip,
      take: input.take,

      orderBy: {
        [input.sort_by]: input.sort_order,
      },
    });
  }

  async count(input: CountTradesRepositoryInput): Promise<number> {
    return Trade.count({
      where: this.build_where(input),
    });
  }

  async create(input: CreateTradeModel): Promise<TradeModel> {
    return Trade.create({
      data: {
        symbol: input.symbol,
        side: input.side,
        quantity: input.quantity,
        price: input.price,
        trader_id: input.trader_id,
        book: input.book,
        counterparty: input.counterparty,
        trade_timestamp: input.trade_timestamp ?? new Date(),
      },
    });
  }

  async update(id: string, trader_id: string, input: UpdateTradeModel): Promise<TradeModel> {
    return Trade.update({
      where: {
        id,
        trader_id,
      },

      data: {
        ...(input.symbol !== undefined && {
          symbol: input.symbol,
        }),

        ...(input.side !== undefined && {
          side: input.side,
        }),

        ...(input.quantity !== undefined && {
          quantity: input.quantity,
        }),

        ...(input.price !== undefined && {
          price: input.price,
        }),

        ...(input.trader_id !== undefined && {
          trader_id: input.trader_id,
        }),

        ...(input.book !== undefined && {
          book: input.book,
        }),

        ...(input.counterparty !== undefined && {
          counterparty: input.counterparty,
        }),

        ...(input.trade_timestamp !== undefined && {
          trade_timestamp: input.trade_timestamp,
        }),
      },
    });
  }

  async cancel(id: string, trader_id: string): Promise<TradeModel> {
    return Trade.update({
      where: {
        id,
        trader_id,
      },

      data: {
        status: 'CANCELLED',
      },
    });
  }

  private build_where(input: ListTradesRepositoryInput | CountTradesRepositoryInput) {
    return {
      trader_id: input.trader_id,

      ...(input.symbol && {
        symbol: {
          contains: input.symbol.toUpperCase(),
          mode: 'insensitive' as const,
        },
      }),

      ...(input.side && {
        side: input.side,
      }),

      ...(input.status && {
        status: input.status,
      }),

      ...(input.book && {
        book: {
          contains: input.book,
          mode: 'insensitive' as const,
        },
      }),

      ...(input.counterparty && {
        counterparty: {
          contains: input.counterparty,
          mode: 'insensitive' as const,
        },
      }),
    };
  }
}
