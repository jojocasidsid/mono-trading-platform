import jwt from '@fastify/jwt';

import type { FastifyInstance } from 'fastify';

export default async function register_jwt(app: FastifyInstance): Promise<void> {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is required');
  }

  await app.register(jwt, {
    secret,
    cookie: {
      cookieName: 'access_token',
      signed: false,
    },
  });
}
