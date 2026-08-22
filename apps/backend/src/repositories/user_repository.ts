import type { UserModel } from '../generated/prisma/models.js';

import type { CreateUserModel } from '../models/user_model.js';

import { ApplicationRepository } from './application_repository.js';

export default class UserRepository extends ApplicationRepository {
  private readonly User = this.db.user;

  async find_by_id(id: string): Promise<UserModel | null> {
    return this.User.findUnique({
      where: {
        id,
      },
    });
  }

  async find_by_email(email: string): Promise<UserModel | null> {
    return this.User.findUnique({
      where: {
        email,
      },
    });
  }

  async find_by_username(username: string): Promise<UserModel | null> {
    return this.User.findUnique({
      where: {
        username,
      },
    });
  }

  async create(input: CreateUserModel): Promise<UserModel> {
    return this.User.create({
      data: {
        email: input.email,
        username: input.username,
        name: input.name,
        password_hash: input.password_hash,

        ...(input.role !== undefined && {
          role: input.role,
        }),
      },
    });
  }
}
