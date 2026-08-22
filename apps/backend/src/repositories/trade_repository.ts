import type { TradeModel } from '../generated/prisma/models.js';

import type { TradeSide, TradeStatus } from '../generated/prisma/enums.js';

import type {
  CreateTradeModel,
  UpdateTradeModel,
  TradeSortField,
  SortOrder,
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
  private readonly Trade = this.db.trade;

  async find_by_id(id: string): Promise<TradeModel | null> {
    return this.Trade.findUnique({
      where: {
        id,
      },
    });
  }

  async list_all_by_status(trader_id: string, status: TradeStatus): Promise<TradeModel[]> {
    return this.Trade.findMany({
      where: {
        trader_id,
        status,
      },

      orderBy: {
        trade_timestamp: 'desc',
      },
    });
  }

  async count_by_status(trader_id: string, status: TradeStatus): Promise<number> {
    return this.Trade.count({
      where: {
        trader_id,
        status,
      },
    });
  }

  async find_by_id_and_trader_id(id: string, trader_id: string): Promise<TradeModel | null> {
    return this.Trade.findUnique({
      where: {
        id,
        trader_id,
      },
    });
  }

  async list(input: ListTradesRepositoryInput): Promise<TradeModel[]> {
    return this.Trade.findMany({
      where: this.build_where(input),

      skip: input.skip,
      take: input.take,

      orderBy: {
        [input.sort_by]: input.sort_order,
      },
    });
  }

  async count(input: CountTradesRepositoryInput): Promise<number> {
    return this.Trade.count({
      where: this.build_where(input),
    });
  }

  async create(input: CreateTradeModel): Promise<TradeModel> {
    return this.Trade.create({
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
    return this.Trade.update({
      where: {
        id,
        trader_id,
        status: 'ACTIVE',
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
    return this.Trade.update({
      where: {
        id,
        trader_id,
        status: 'ACTIVE',
      },

      data: {
        status: 'CANCELLED',
      },
    });
  }

  async close(id: string, trader_id: string): Promise<TradeModel> {
    return this.Trade.update({
      where: {
        id,
        trader_id,
        status: 'ACTIVE',
      },

      data: {
        status: 'CLOSED',
      },
    });
  }

  private build_where(input: ListTradesRepositoryInput | CountTradesRepositoryInput) {
    return {
      trader_id: input.trader_id,

      ...(input.symbol && {
        symbol: {
          contains: input.symbol,
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
