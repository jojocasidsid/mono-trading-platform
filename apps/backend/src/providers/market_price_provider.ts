import { nyse_100_stocks } from '../../prisma/seed-data/stocks.js';

import { publish_market_price_updated } from '../publishers/market_price_publisher.js';

export interface MarketPrice {
  symbol: string;
  name: string;
  price: number;
}

const market_prices = new Map<string, MarketPrice>(
  nyse_100_stocks.map(stock => [
    stock.symbol,
    {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.base_price,
    },
  ])
);

let simulator: ReturnType<typeof setInterval> | undefined;

export function get_market_price(symbol: string): MarketPrice | undefined {
  return market_prices.get(symbol.toUpperCase());
}

export function get_market_prices(): MarketPrice[] {
  return Array.from(market_prices.values());
}

function simulate_price(price: number): number {
  const percentage_move = (Math.random() - 0.5) * 0.01;

  return Number((price * (1 + percentage_move)).toFixed(2));
}

function update_market_prices(): void {
  for (const [symbol, market_price] of market_prices) {
    const previous_price = market_price.price;

    const price = simulate_price(previous_price);

    const updated_market_price: MarketPrice = {
      ...market_price,
      price,
    };

    market_prices.set(symbol, updated_market_price);

    publish_market_price_updated({
      symbol,
      price,
      previous_price,
      updated_at: new Date(),
    });
  }
}

export function start_market_price_provider(): void {
  if (simulator) {
    return;
  }

  simulator = setInterval(update_market_prices, 1_000);
}

export function stop_market_price_provider(): void {
  if (!simulator) {
    return;
  }

  clearInterval(simulator);

  simulator = undefined;
}
