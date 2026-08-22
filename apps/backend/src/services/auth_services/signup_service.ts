import bcrypt from 'bcrypt';

import { type SignupRequest } from '@fusion/shared';

import type { UserModel } from '../../generated/prisma/models.js';

import UserRepository from '../../repositories/user_repository.js';

import { ConflictError } from '../../shared/errors/conflict_error.js';

export default class SignupService {
  constructor(private readonly user_repository = new UserRepository()) {}

  async execute(input: SignupRequest): Promise<UserModel> {
    const existing_email = await this.user_repository.find_by_email(input.email);

    if (existing_email) {
      throw new ConflictError([
        {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email is already registered.',
          pointer: 'email',
        },
      ]);
    }

    const existing_username = await this.user_repository.find_by_username(input.username);

    if (existing_username) {
      throw new ConflictError([
        {
          code: 'USERNAME_ALREADY_EXISTS',
          message: 'Username is already taken.',
          pointer: 'username',
        },
      ]);
    }

    const password_hash = await bcrypt.hash(input.password, 10);

    return this.user_repository.create({
      email: input.email,
      username: input.username,
      name: input.name,
      password_hash,
      role: 'TRADER',
    });
  }
}
