import type { TradeHistoryModel } from '../generated/prisma/models.js';

import type { CreateTradeHistoryModel } from '../models/trade_history_model.js';

import { ApplicationRepository } from './application_repository.js';

export interface ListTradeHistoryRepositoryInput {
  trader_id: string;
  skip: number;
  take: number;
}

export default class TradeHistoryRepository extends ApplicationRepository {
  private readonly TradeHistory = this.db.tradeHistory;

  async create(input: CreateTradeHistoryModel): Promise<TradeHistoryModel> {
    return this.TradeHistory.create({
      data: {
        trade_id: input.trade_id,
        action: input.action,
      },
    });
  }

  async list(input: ListTradeHistoryRepositoryInput): Promise<TradeHistoryModel[]> {
    return this.TradeHistory.findMany({
      where: {
        trade: {
          trader_id: input.trader_id,
        },
      },

      include: {
        trade: {
          select: {
            id: true,
            symbol: true,
            side: true,
            quantity: true,
            price: true,
            book: true,
            counterparty: true,
            status: true,
            trade_timestamp: true,
          },
        },
      },

      skip: input.skip,
      take: input.take,

      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async count(trader_id: string): Promise<number> {
    return this.TradeHistory.count({
      where: {
        trade: {
          trader_id,
        },
      },
    });
  }
}
