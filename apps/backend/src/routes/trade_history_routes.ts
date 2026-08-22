import type { FastifyInstance } from 'fastify';

import { TradeHistoryController } from '../controllers/trade_history_controller.js';

import authenticate from '../shared/auth/authenticate.js';

export async function trade_history_routes(app: FastifyInstance): Promise<void> {
  const controller = new TradeHistoryController();

  app.addHook('preHandler', authenticate);

  app.get('/', controller.list);
}
