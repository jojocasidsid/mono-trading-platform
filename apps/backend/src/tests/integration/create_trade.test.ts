import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { FastifyInstance } from 'fastify';

import { create_authenticated_user } from '../helpers/auth_helper.js';
import { build_app } from '../../app.js';

describe('Create Trade Integration', () => {
  let app: FastifyInstance;
  let cookies: string;

  beforeAll(async () => {
    app = await build_app();
    await app.ready();

    const auth = await create_authenticated_user(app);

    cookies = auth.cookies;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a trade', async () => {
    const response = await app.inject({
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

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body.data).toMatchObject({
      symbol: 'AAPL',
      side: 'BUY',
      quantity: 10,
      status: 'ACTIVE',
    });

    expect(body.data.id).toBeDefined();
  });

  it('rejects creation without authentication', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/trades',
      payload: {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        price: 100,
        book: 'TEST',
        counterparty: 'TEST_COUNTERPARTY',
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejects an invalid quantity', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/trades',
      headers: {
        cookie: cookies,
      },
      payload: {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 0,
        price: 100,
        book: 'TEST',
        counterparty: 'TEST_COUNTERPARTY',
      },
    });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.statusCode).toBeLessThan(500);
  });

  it('rejects an invalid side', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/trades',
      headers: {
        cookie: cookies,
      },
      payload: {
        symbol: 'AAPL',
        side: 'INVALID',
        quantity: 10,
        price: 100,
        book: 'TEST',
        counterparty: 'TEST_COUNTERPARTY',
      },
    });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.statusCode).toBeLessThan(500);
  });
});
