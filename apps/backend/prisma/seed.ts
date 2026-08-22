import bcrypt from 'bcrypt';

import { PrismaPg } from '@prisma/adapter-pg';

import {
  Prisma,
  PrismaClient,
  TradeHistoryAction,
  TradeSide,
  TradeStatus,
  UserRole,
} from '../src/generated/prisma/client.js';

import { SEED_PASSWORD, seed_users } from './seed-data/users.js';

import { nyse_100_stocks } from './seed-data/stocks.js';

const connection_string = process.env.DATABASE_URL;

if (!connection_string) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({
  connectionString: connection_string,
});

const prisma = new PrismaClient({
  adapter,
});

const TRADES_PER_USER = 200;

const books = ['EQUITIES_US', 'TECH_GROWTH', 'GLOBAL_EQUITIES', 'LARGE_CAP_US'];

const counterparties = [
  'Goldman Sachs',
  'JP Morgan',
  'Morgan Stanley',
  'Barclays',
  'Citigroup',
  'Bank of America',
];

function random_item<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function random_integer(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random_trade_price(base_price: number): number {
  // Keep generated execution price
  // within roughly ±10% of market price.
  const percentage_move = (Math.random() - 0.5) * 0.2;

  return Number((base_price * (1 + percentage_move)).toFixed(2));
}

function random_timestamp(): Date {
  const now = Date.now();

  const market_day_start = now - 8 * 60 * 60 * 1000;

  return new Date(random_integer(market_day_start, now));
}

function random_trade_status(): TradeStatus {
  const random = Math.random();

  if (random < 0.85) {
    return TradeStatus.ACTIVE;
  }

  if (random < 0.93) {
    return TradeStatus.CANCELLED;
  }

  return TradeStatus.CLOSED;
}

async function seed_users_into_database() {
  const password_hash = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const user of seed_users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },

      update: {
        username: user.username,
        name: user.name,
        password_hash,

        role: user.role === 'ADMIN' ? UserRole.ADMIN : UserRole.TRADER,
      },

      create: {
        email: user.email,
        username: user.username,
        name: user.name,
        password_hash,

        role: user.role === 'ADMIN' ? UserRole.ADMIN : UserRole.TRADER,
      },
    });
  }
}

async function clear_trade_data() {
  await prisma.$transaction(async transaction => {
    await transaction.tradeHistory.deleteMany();

    await transaction.trade.deleteMany();
  });
}

async function seed_trades() {
  const users = await prisma.user.findMany({
    where: {
      role: UserRole.TRADER,
    },
  });

  if (users.length === 0) {
    throw new Error('No trader users available.');
  }

  await clear_trade_data();

  const trades: Prisma.TradeCreateManyInput[] = [];

  for (const user of users) {
    for (let i = 0; i < TRADES_PER_USER; i++) {
      const stock = random_item(nyse_100_stocks);

      const status = random_trade_status();

      trades.push({
        symbol: stock.symbol,

        side: random_item([TradeSide.BUY, TradeSide.SELL]),

        quantity: random_integer(100, 10_000),

        price: random_trade_price(stock.base_price),

        trader_id: user.id,

        book: random_item(books),

        counterparty: random_item(counterparties),

        trade_timestamp: random_timestamp(),

        status,
      });
    }
  }

  const created_trades = await prisma.$transaction(async transaction => {
    const result = [];

    for (const trade of trades) {
      const created_trade = await transaction.trade.create({
        data: trade,
      });

      await transaction.tradeHistory.create({
        data: {
          trade_id: created_trade.id,

          action: TradeHistoryAction.CREATED,
        },
      });

      if (trade.status === TradeStatus.CANCELLED) {
        await transaction.tradeHistory.create({
          data: {
            trade_id: created_trade.id,

            action: TradeHistoryAction.CANCELLED,
          },
        });
      }

      if (trade.status === TradeStatus.CLOSED) {
        await transaction.tradeHistory.create({
          data: {
            trade_id: created_trade.id,

            action: TradeHistoryAction.CLOSED,
          },
        });
      }

      result.push(created_trade);
    }

    return result;
  });

  console.log(`Seeded ${created_trades.length} trades for ${users.length} traders.`);
}

async function main() {
  console.log('Starting database seed...');

  console.log('Seeding users...');

  await seed_users_into_database();

  console.log('Users seeded.');

  console.log('Seeding trades...');

  await seed_trades();

  console.log('');
  console.log('Seed complete.');
  console.log('');

  console.log('Development credentials:');

  console.log(`Password: ${SEED_PASSWORD}`);

  for (const user of seed_users) {
    console.log(`${user.email} (${user.role})`);
  }
}

main()
  .catch(error => {
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
