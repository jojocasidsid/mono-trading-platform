import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { FastifyInstance } from 'fastify';

import { create_authenticated_user } from '../helpers/auth_helper.js';
import { build_app } from '../../app.js';

describe('Trade History Integration', () => {
  let app: FastifyInstance;
  let cookies: string;
  let trade_id: string;

  beforeAll(async () => {
    app = await build_app();

    await app.ready();

    const auth = await create_authenticated_user(app);

    cookies = auth.cookies;

    const createResponse = await app.inject({
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

    expect(createResponse.statusCode).toBe(201);

    trade_id = createResponse.json().data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns trade history for the authenticated trader', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trade-history',

      headers: {
        cookie: cookies,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.data).toBeInstanceOf(Array);

    expect(body.data.length).toBeGreaterThan(0);
  });

  it('includes related trade details', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trade-history',

      headers: {
        cookie: cookies,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    const history = body.data.find((item: { trade_id: string }) => item.trade_id === trade_id);

    expect(history).toBeDefined();

    expect(history).toMatchObject({
      trade_id,
    });

    expect(history.trade).toMatchObject({
      id: trade_id,
      symbol: 'AAPL',
      side: 'BUY',
      quantity: 10,
      status: 'ACTIVE',
    });
  });

  it('creates history after updating a trade', async () => {
    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/api/trades/${trade_id}`,

      headers: {
        cookie: cookies,
      },

      payload: {
        quantity: 20,
      },
    });

    expect(updateResponse.statusCode).toBe(200);

    const historyResponse = await app.inject({
      method: 'GET',
      url: '/api/trade-history',

      headers: {
        cookie: cookies,
      },
    });

    expect(historyResponse.statusCode).toBe(200);

    const body = historyResponse.json();

    const matchingHistory = body.data.filter(
      (item: { trade_id: string }) => item.trade_id === trade_id
    );

    expect(matchingHistory.length).toBeGreaterThanOrEqual(2);
  });

  it('creates history after cancelling a trade', async () => {
    const createResponse = await app.inject({
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

    expect(createResponse.statusCode).toBe(201);

    const newTradeId = createResponse.json().data.id;

    const cancelResponse = await app.inject({
      method: 'POST',
      url: `/api/trades/${newTradeId}/cancel`,

      headers: {
        cookie: cookies,
      },
    });

    expect(cancelResponse.statusCode).toBe(200);

    const historyResponse = await app.inject({
      method: 'GET',
      url: '/api/trade-history',

      headers: {
        cookie: cookies,
      },
    });

    const body = historyResponse.json();

    const matchingHistory = body.data.filter(
      (item: { trade_id: string }) => item.trade_id === newTradeId
    );

    expect(matchingHistory.length).toBeGreaterThanOrEqual(2);
  });

  it('creates history after closing a trade', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/trades',

      headers: {
        cookie: cookies,
      },

      payload: {
        symbol: 'TSLA',
        side: 'BUY',
        quantity: 5,
        price: 300,
        book: 'TEST',
        counterparty: 'TEST_COUNTERPARTY',
      },
    });

    expect(createResponse.statusCode).toBe(201);

    const newTradeId = createResponse.json().data.id;

    const closeResponse = await app.inject({
      method: 'POST',
      url: `/api/trades/${newTradeId}/close`,

      headers: {
        cookie: cookies,
      },
    });

    expect(closeResponse.statusCode).toBe(200);

    const historyResponse = await app.inject({
      method: 'GET',
      url: '/api/trade-history',

      headers: {
        cookie: cookies,
      },
    });

    const body = historyResponse.json();

    const matchingHistory = body.data.filter(
      (item: { trade_id: string }) => item.trade_id === newTradeId
    );

    expect(matchingHistory.length).toBeGreaterThanOrEqual(2);
  });

  it('only returns history belonging to the authenticated trader', async () => {
    const other = await create_authenticated_user(app);

    const otherTradeResponse = await app.inject({
      method: 'POST',
      url: '/api/trades',

      headers: {
        cookie: other.cookies,
      },

      payload: {
        symbol: 'NVDA',
        side: 'BUY',
        quantity: 3,
        price: 180,
        book: 'TEST',
        counterparty: 'TEST_COUNTERPARTY',
      },
    });

    const otherTradeId = otherTradeResponse.json().data.id;

    const response = await app.inject({
      method: 'GET',
      url: '/api/trade-history',

      headers: {
        cookie: cookies,
      },
    });

    const body = response.json();

    const leakedHistory = body.data.find(
      (item: { trade_id: string }) => item.trade_id === otherTradeId
    );

    expect(leakedHistory).toBeUndefined();
  });

  it('returns 401 without authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/trade-history',
    });

    expect(response.statusCode).toBe(401);
  });
});
