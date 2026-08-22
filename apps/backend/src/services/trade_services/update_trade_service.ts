import { Prisma } from '../../generated/prisma/client.js';

import type { TradeModel } from '../../generated/prisma/models.js';

import type { UpdateTradeRequest } from '@fusion/shared';

import type { UpdateTradeModel } from '../../models/trade_model.js';

import TradeRepository from '../../repositories/trade_repository.js';
import UserRepository from '../../repositories/user_repository.js';

import { BadRequestError } from '../../shared/errors/bad_request_error.js';
import { ConflictError } from '../../shared/errors/conflict_error.js';
import { NotFoundError } from '../../shared/errors/not_found_error.js';

export default class UpdateTradeService {
  constructor(
    private readonly trade_repository = new TradeRepository(),
    private readonly user_repository = new UserRepository()
  ) {}

  async execute(id: string, trader_id: string, input: UpdateTradeRequest): Promise<TradeModel> {
    const trade = await this.trade_repository.find_by_id(id);

    if (!trade) {
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
          message: 'Cancelled trades cannot be amended.',
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

    const update_input: UpdateTradeModel = {
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
    };

    try {
      return await this.trade_repository.update(id, trader_id, update_input);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError([
          {
            code: 'TRADE_NOT_FOUND',
            message: 'Trade not found.',
          },
        ]);
      }

      throw error;
    }
  }
}
