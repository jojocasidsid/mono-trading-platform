import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { FastifyInstance } from 'fastify';
import { build_app } from '../../app.js';

describe('Auth Integration', () => {
  let app: FastifyInstance;

  const uniqueId = Date.now();

  const user = {
    email: `integration-${uniqueId}@tradeticker.test`,
    username: `integration_${uniqueId}`,
    name: 'Integration Test User',
    password: 'Password123!',
  };

  let accessCookie: string;
  let refreshCookie: string;

  beforeAll(async () => {
    app = await build_app();

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('signs up a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/signup',
      payload: user,
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body).toHaveProperty('data');

    expect(body.data).toMatchObject({
      email: user.email,
      username: user.username,
      name: user.name,
    });

    expect(body.data.password).toBeUndefined();
  });

  it('rejects login with an incorrect password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: user.email,
        password: 'WrongPassword123!',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('logs in with valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: user.email,
        password: user.password,
      },
    });

    expect(response.statusCode).toBe(200);

    const setCookies = response.cookies;

    const accessTokenCookie = setCookies.find(cookie => cookie.name === 'access_token');

    const refreshTokenCookie = setCookies.find(cookie => cookie.name === 'refresh_token');

    expect(accessTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();

    expect(accessTokenCookie?.httpOnly).toBe(true);
    expect(refreshTokenCookie?.httpOnly).toBe(true);

    accessCookie = `${accessTokenCookie!.name}=${accessTokenCookie!.value}`;

    refreshCookie = `${refreshTokenCookie!.name}=${refreshTokenCookie!.value}`;
  });

  it('returns 401 when /me is called without authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
    });

    expect(response.statusCode).toBe(401);
  });

  it('returns the authenticated user from /me', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: accessCookie,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.data).toMatchObject({
      email: user.email,
      username: user.username,
      name: user.name,
    });

    expect(body.data.password).toBeUndefined();
  });

  it('refreshes the access token using the refresh cookie', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      headers: {
        cookie: refreshCookie,
      },
    });

    expect(response.statusCode).toBe(200);

    const newAccessCookie = response.cookies.find(cookie => cookie.name === 'access_token');

    expect(newAccessCookie).toBeDefined();

    expect(newAccessCookie?.httpOnly).toBe(true);

    accessCookie = `${newAccessCookie!.name}=${newAccessCookie!.value}`;
  });

  it('rejects refresh when refresh cookie is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
    });

    expect(response.statusCode).toBe(401);
  });

  it('allows the refreshed access token to access /me', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: accessCookie,
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json().data).toMatchObject({
      email: user.email,
    });
  });

  it('logs out and clears authentication cookies', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: {
        cookie: `${accessCookie}; ${refreshCookie}`,
      },
    });

    expect(response.statusCode).toBe(204);

    const accessTokenCookie = response.cookies.find(cookie => cookie.name === 'access_token');

    const refreshTokenCookie = response.cookies.find(cookie => cookie.name === 'refresh_token');

    expect(accessTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();

    expect(accessTokenCookie?.value).toBe('');
    expect(refreshTokenCookie?.value).toBe('');
  });
});
