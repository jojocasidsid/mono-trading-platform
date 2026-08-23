import type { FastifyReply, FastifyRequest } from 'fastify';

import { login_schema, signup_schema } from '@fusion/shared';

import LoginService from '../services/auth_services/login_service.js';

import SignupService from '../services/auth_services/signup_service.js';

import UserRepository from '../repositories/user_repository.js';

import { ApplicationController } from './application_controller.js';

import { UnauthorizedError } from '../shared/errors/unauthorized_error.js';

export class AuthController extends ApplicationController {
  private readonly accessCookieName = 'access_token';

  private readonly refreshCookieName = 'refresh_token';

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const input = login_schema.parse(request.body);

    const service = new LoginService();

    const user = await service.execute(input);

    const accessToken = await reply.jwtSign(
      {
        user_id: user.id,
        role: user.role,
        token_type: 'access',
      },
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      }
    );

    const refreshToken = await reply.jwtSign(
      {
        user_id: user.id,
        role: user.role,
        token_type: 'refresh',
      },
      {
        key: process.env.JWT_REFRESH_SECRET!,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
      }
    );

    this.setAuthCookies(reply, accessToken, refreshToken);

    return reply.send({
      data: this.serializeUser(user),
    });
  };

  signup = async (request: FastifyRequest, reply: FastifyReply) => {
    const input = signup_schema.parse(request.body);

    const service = new SignupService();

    const user = await service.execute(input);

    return reply.status(201).send({
      data: this.serializeUser(user),
    });
  };

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies[this.refreshCookieName];

    if (!refreshToken) {
      throw new UnauthorizedError([
        {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token is required.',
        },
      ]);
    }

    let payload: {
      user_id: string;
      role: string;
      token_type: string;
    };

    try {
      payload = request.server.jwt.verify(refreshToken, {
        key: process.env.JWT_REFRESH_SECRET!,
      });
    } catch {
      throw new UnauthorizedError([
        {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token is invalid or expired.',
        },
      ]);
    }

    if (payload.token_type !== 'refresh') {
      throw new UnauthorizedError([
        {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token is invalid.',
        },
      ]);
    }

    const userRepository = new UserRepository();

    const user = await userRepository.find_by_id(payload.user_id);

    if (!user) {
      throw new UnauthorizedError([
        {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token is invalid.',
        },
      ]);
    }

    const accessToken = await reply.jwtSign(
      {
        user_id: user.id,
        role: user.role,
        token_type: 'access',
      },
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      }
    );

    reply.setCookie(this.accessCookieName, accessToken, this.accessCookieOptions());

    return reply.send({
      data: this.serializeUser(user),
    });
  };

  me = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = this.get_trader_id(request);

    const userRepository = new UserRepository();

    const user = await userRepository.find_by_id(userId);

    if (!user) {
      throw new UnauthorizedError([
        {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required.',
        },
      ]);
    }

    return reply.send({
      data: this.serializeUser(user),
    });
  };

  logout = async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('access_token', {
      path: '/',
    });

    reply.clearCookie('refresh_token', {
      path: '/api/auth',
    });

    return reply.status(204).send();
  };

  private setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string): void {
    reply.setCookie(this.accessCookieName, accessToken, this.accessCookieOptions());

    reply.setCookie(this.refreshCookieName, refreshToken, this.refreshCookieOptions());
  }

  private accessCookieOptions() {
    return {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax' as const,

      path: '/',

      maxAge: 15 * 60,
    };
  }

  private refreshCookieOptions() {
    return {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax' as const,

      path: '/api/auth',

      maxAge: 7 * 24 * 60 * 60,
    };
  }

  private serializeUser(user: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: string;
  }) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    };
  }
}
