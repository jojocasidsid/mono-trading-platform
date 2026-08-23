import { build_app } from './app.js';
import { start_market_price_provider } from './providers/market_price_provider.js';

const app = await build_app();

async function start(): Promise<void> {
  try {
    await app.listen({
      port: 3000,
      host: '0.0.0.0',
    });

    start_market_price_provider();

    app.log.info('Stock price simulator started.');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
