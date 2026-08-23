import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { FastifyInstance } from 'fastify';

import { create_authenticated_user } from '../helpers/auth_helper.js';
import { build_app } from '../../app.js';

describe('List Trades Integration', () => {
  let app: FastifyInstance;
  let cookies: string;

  beforeAll(async () => {
    app = await build_app();
    await app.ready();

    const auth = await create_authenticated_user(app);

    cookies = auth.cookies;

    await app.inject({
      method: 'POST',
      url: '/api/trades',
      headers: {
        cookie: cookies,
      },
      payload: {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        price: 100,
        book: 'TEST',
        counterparty: 'TEST_COUNTERPARTY',
      },
    });

    await app.inject({
      method: 'POST',
      url: '/api/trades',
      headers: {
        cookie: cookies,
      },
      payload: {
        symbol: 'MSFT',
        side: 'SELL',
        quantity: 5,
        price: 200,
        book: 'TEST',
        counterparty: 'TEST_COUNTERPARTY',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns trades belonging to the authenticated trader', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trades',
      headers: {
        cookie: cookies,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('filters trades by symbol', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trades?symbol=AAPL',
      headers: {
        cookie: cookies,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.data.length).toBeGreaterThan(0);

    expect(body.data.every((trade: { symbol: string }) => trade.symbol === 'AAPL')).toBe(true);
  });

  it('filters trades by side', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trades?side=BUY',
      headers: {
        cookie: cookies,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.data.every((trade: { side: string }) => trade.side === 'BUY')).toBe(true);
  });

  it('returns 401 without authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trades',
    });

    expect(response.statusCode).toBe(401);
  });
});
