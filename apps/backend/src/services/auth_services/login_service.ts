import bcrypt from 'bcrypt';

import { type LoginRequest } from '@fusion/shared';

import type { UserModel } from '../../generated/prisma/models.js';

import UserRepository from '../../repositories/user_repository.js';

import { BadRequestError } from '../../shared/errors/bad_request_error.js';

export default class LoginService {
  constructor(private readonly user_repository = new UserRepository()) {}

  async execute(input: LoginRequest): Promise<UserModel> {
    const user = await this.user_repository.find_by_email(input.email);

    if (!user) {
      throw new BadRequestError([
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      ]);
    }

    const password_valid = await bcrypt.compare(input.password, user.password_hash);

    if (!password_valid) {
      throw new BadRequestError([
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      ]);
    }

    return user;
  }
}
