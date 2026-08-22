import jwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';

export default async function register_jwt(app: FastifyInstance) {
  const access_secret = process.env.JWT_ACCESS_SECRET;

  const refresh_secret = process.env.JWT_REFRESH_SECRET;

  if (!access_secret) {
    throw new Error('JWT_ACCESS_SECRET is required');
  }

  if (!refresh_secret) {
    throw new Error('JWT_REFRESH_SECRET is required');
  }

  // Access token
  await app.register(jwt, {
    secret: access_secret,
  });

  // Refresh token
  await app.register(jwt, {
    secret: refresh_secret,
    namespace: 'refresh',
  });
}
