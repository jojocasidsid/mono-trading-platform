import Fastify from 'fastify';

import { auth_routes } from './routes/auth_routes.js';
import { trade_routes } from './routes/trade_routes.js';

import register_jwt from './shared/auth/jwt.js';
import ErrorHandler from './shared/errors/error_handler.js';

export async function build_app() {
  const app = Fastify({
    logger: true,
  });

  await register_jwt(app);

  app.setErrorHandler(ErrorHandler);

  app.get('/health', async () => {
    return {
      status: 'ok',
    };
  });

  await app.register(auth_routes, {
    prefix: '/api/auth',
  });

  await app.register(trade_routes, {
    prefix: '/api/trades',
  });

  return app;
}
