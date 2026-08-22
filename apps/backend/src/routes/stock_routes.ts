import type { FastifyInstance } from 'fastify';

import { StockController } from '../controllers/stock_controller.js';

import authenticate from '../shared/auth/authenticate.js';

export async function stock_routes(app: FastifyInstance): Promise<void> {
  const stock_controller = new StockController();

  app.addHook('preHandler', authenticate);

  app.get('/', stock_controller.list);

  app.get('/prices', stock_controller.prices);
}
