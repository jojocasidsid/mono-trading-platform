import type { FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../shared/errors/unauthorized_error.js';

export interface AuthUser {
  user_id: string;
  role: 'ADMIN' | 'TRADER';
}

export abstract class ApplicationController {
  protected get_user(request: FastifyRequest): AuthUser {
    const user = request.user as AuthUser | undefined;

    if (!user?.user_id) {
      throw new UnauthorizedError([
        {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required.',
        },
      ]);
    }

    return user;
  }

  protected get_trader_id(request: FastifyRequest): string {
    return this.get_user(request).user_id;
  }
}
