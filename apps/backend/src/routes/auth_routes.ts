import type { FastifyInstance } from 'fastify';

import { AuthController } from '../controllers/auth_controller.js';

import type { SignupUserModel } from '../models/user_model.js';
import authenticate from '../shared/auth/authenticate.js';

export async function auth_routes(app: FastifyInstance): Promise<void> {
  const auth_controller = new AuthController();

  app.post<{
    Body: SignupUserModel;
  }>('/signup', auth_controller.signup);

  app.post<{
    Body: {
      email: string;
      password: string;
    };
  }>('/login', auth_controller.login);

  app.post<{
    Body: {
      refresh_token: string;
    };
  }>('/refresh', auth_controller.refresh);

  app.get(
    '/me',
    {
      preHandler: [authenticate],
    },
    auth_controller.me
  );
}
