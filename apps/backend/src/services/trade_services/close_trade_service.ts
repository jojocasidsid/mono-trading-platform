import { Prisma } from '../../generated/prisma/client.js';

import type { TradeModel } from '../../generated/prisma/models.js';

import TradeRepository from '../../repositories/trade_repository.js';

import TradeHistoryRepository from '../../repositories/trade_history_repository.js';

import UserRepository from '../../repositories/user_repository.js';

import { BadRequestError } from '../../shared/errors/bad_request_error.js';

import { ConflictError } from '../../shared/errors/conflict_error.js';

import { NotFoundError } from '../../shared/errors/not_found_error.js';

import prisma from '../../lib/prisma.js';
import { publish_trade_closed } from '../../publishers/trade_publisher.js';

export default class CloseTradeService {
  constructor(
    private readonly trade_repository = new TradeRepository(),
    private readonly user_repository = new UserRepository()
  ) {}

  async execute(id: string, trader_id: string): Promise<TradeModel> {
    const trade = await this.trade_repository.find_by_id(id);

    if (!trade) {
      throw new NotFoundError([
        {
          code: 'TRADE_NOT_FOUND',
          message: 'Trade not found.',
        },
      ]);
    }

    if (trade.trader_id !== trader_id) {
      throw new NotFoundError([
        {
          code: 'TRADE_NOT_FOUND',
          message: 'Trade not found.',
        },
      ]);
    }

    if (trade.status === 'CANCELLED') {
      throw new ConflictError([
        {
          code: 'TRADE_CANCELLED',
          message: 'Cancelled trades cannot be closed.',
        },
      ]);
    }

    if (trade.status === 'CLOSED') {
      throw new ConflictError([
        {
          code: 'TRADE_ALREADY_CLOSED',
          message: 'Trade is already closed.',
        },
      ]);
    }

    const trader = await this.user_repository.find_by_id(trader_id);

    if (!trader) {
      throw new NotFoundError([
        {
          code: 'TRADER_NOT_FOUND',
          message: 'Trader not found.',
          pointer: 'trader_id',
        },
      ]);
    }

    if (trader.role !== 'TRADER') {
      throw new BadRequestError([
        {
          code: 'INVALID_TRADER',
          message: 'Selected user is not a trader.',
          pointer: 'trader_id',
        },
      ]);
    }

    try {
      const trade = await prisma.$transaction(async transaction => {
        const transaction_trade_repository = new TradeRepository(transaction);

        const transaction_trade_history_repository = new TradeHistoryRepository(transaction);

        const closed_trade = await transaction_trade_repository.close(id, trader_id);

        await transaction_trade_history_repository.create({
          trade_id: closed_trade.id,
          action: 'CLOSED',
        });

        return closed_trade;
      });

      publish_trade_closed(trade);

      return trade;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ConflictError([
          {
            code: 'TRADE_NOT_ACTIVE',
            message: 'Trade can no longer be closed.',
          },
        ]);
      }

      throw error;
    }
  }
}
