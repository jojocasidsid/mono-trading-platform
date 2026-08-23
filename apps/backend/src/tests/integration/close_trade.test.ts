import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { FastifyInstance } from 'fastify';

import { create_authenticated_user } from '../helpers/auth_helper.js';
import { build_app } from '../../app.js';

describe('Close Trade Integration', () => {
  let app: FastifyInstance;
  let cookies: string;
  let trade_id: string;

  beforeAll(async () => {
    app = await build_app();
    await app.ready();

    const auth = await create_authenticated_user(app);

    cookies = auth.cookies;

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

    trade_id = response.json().data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('closes an active trade', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/trades/${trade_id}/close`,
      headers: {
        cookie: cookies,
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json().data).toMatchObject({
      id: trade_id,
      status: 'CLOSED',
    });
  });

  it('does not allow a closed trade to be closed again', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/trades/${trade_id}/close`,
      headers: {
        cookie: cookies,
      },
    });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.statusCode).toBeLessThan(500);
  });
});
