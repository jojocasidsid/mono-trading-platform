import type { FastifyReply, FastifyRequest } from 'fastify';

import { login_schema, signup_schema, type LoginRequest, type SignupRequest } from '@fusion/shared';

import LoginService from '../services/auth_services/login_service.js';
import SignupService from '../services/auth_services/signup_service.js';

import { ApplicationController } from './application_controller.js';
import GetUserService from '../services/auth_services/get_user_service.js';

interface RefreshRequestBody {
  refresh_token: string;
}

export class AuthController extends ApplicationController {
  signup = async (
    request: FastifyRequest<{
      Body: SignupRequest;
    }>,
    reply: FastifyReply
  ) => {
    const input = signup_schema.parse(request.body);

    const service = new SignupService();

    const user = await service.execute(input);

    return reply.status(201).send({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  };

  login = async (
    request: FastifyRequest<{
      Body: LoginRequest;
    }>,
    reply: FastifyReply
  ) => {
    const input = login_schema.parse(request.body);

    const service = new LoginService();

    const user = await service.execute(input);

    const payload = {
      user_id: user.id,
      role: user.role,
    };

    const access_token = await reply.jwtSign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    });

    const refresh_token = await reply.refreshJwtSign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    });

    return reply.send({
      access_token,
      refresh_token,
      token_type: 'Bearer',

      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  };

  refresh = async (
    request: FastifyRequest<{
      Body: RefreshRequestBody;
    }>,
    reply: FastifyReply
  ) => {
    const payload = await request.refreshJwtVerify<{
      user_id: string;
      role: 'ADMIN' | 'TRADER';
    }>(request.body.refresh_token);

    const access_token = await reply.jwtSign(
      {
        user_id: payload.user_id,
        role: payload.role,
      },
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      }
    );

    const refresh_token = await reply.refreshJwtSign(
      {
        user_id: payload.user_id,
        role: payload.role,
      },
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
      }
    );

    return reply.send({
      access_token,
      refresh_token,
      token_type: 'Bearer',
    });
  };

  me = async (request: FastifyRequest, reply: FastifyReply) => {
    const user_id = this.get_trader_id(request);

    const service = new GetUserService();

    const user = await service.execute(user_id);

    return reply.send({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  };
}
