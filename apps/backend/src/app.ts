import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { auth_routes } from './routes/auth_routes.js';
import { trade_routes } from './routes/trade_routes.js';
import { websocket_routes } from './routes/websocket_routes.js';
import { stock_routes } from './routes/stock_routes.js';
import { trade_history_routes } from './routes/trade_history_routes.js';
import register_jwt from './shared/auth/jwt.js';
import ErrorHandler from './shared/errors/error_handler.js';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

export async function build_app() {
  const app = Fastify({
    logger: true,
  });

  await app.register(websocket);

  await app.register(cors, {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.register(cookie);

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

  await app.register(stock_routes, {
    prefix: '/api/stocks',
  });

  await app.register(trade_history_routes, {
    prefix: '/api/trade-history',
  });

  await app.register(websocket_routes, {
    prefix: '/ws',
  });

  return app;
}
