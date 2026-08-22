import { type CreateTradeRequest } from '@fusion/shared';

import type { TradeModel } from '../../generated/prisma/models.js';

import TradeRepository from '../../repositories/trade_repository.js';
import UserRepository from '../../repositories/user_repository.js';

import { BadRequestError } from '../../shared/errors/bad_request_error.js';
import { NotFoundError } from '../../shared/errors/not_found_error.js';

export default class CreateTradeService {
  constructor(
    private readonly trade_repository = new TradeRepository(),
    private readonly user_repository = new UserRepository()
  ) {}

  async execute(trader_id: string, input: CreateTradeRequest): Promise<TradeModel> {
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

    return this.trade_repository.create({
      ...input,
      trader_id,
    });
  }
}
