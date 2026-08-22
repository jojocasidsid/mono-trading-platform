import type { FastifyInstance } from 'fastify';

import type { CreateTradeModel, UpdateTradeModel } from '../models/trade_model.js';

import { TradeController, type TradeParams } from '../controllers/trade_controller.js';

import authenticate from '../shared/auth/authenticate.js';

export async function trade_routes(app: FastifyInstance): Promise<void> {
  const trade_controller = new TradeController();

  app.addHook('preHandler', authenticate);

  app.get('/', trade_controller.list);

  app.post<{
    Body: CreateTradeModel;
  }>('/', trade_controller.create);

  app.patch<{
    Params: TradeParams;
    Body: UpdateTradeModel;
  }>('/:id', trade_controller.update);

  app.post<{
    Params: TradeParams;
  }>('/:id/cancel', trade_controller.cancel);
}
