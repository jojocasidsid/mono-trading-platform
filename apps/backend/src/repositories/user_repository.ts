import type { UserModel } from '../generated/prisma/models.js';

import User, { type CreateUserModel } from '../models/user_model.js';

import { ApplicationRepository } from './application_repository.js';

export interface ListUsersRepositoryInput {
  skip: number;
  take: number;
}

export default class UserRepository extends ApplicationRepository {
  async list(input: ListUsersRepositoryInput): Promise<UserModel[]> {
    return User.findMany({
      skip: input.skip,
      take: input.take,

      orderBy: {
        name: 'asc',
      },
    });
  }

  async count(): Promise<number> {
    return User.count();
  }

  async find_by_email(email: string): Promise<UserModel | null> {
    return User.findUnique({
      where: {
        email,
      },
    });
  }

  async find_by_id(id: string): Promise<UserModel | null> {
    return User.findUnique({
      where: {
        id,
      },
    });
  }

  async create(input: CreateUserModel): Promise<UserModel> {
    return User.create({
      data: input,
    });
  }

  async find_by_username(username: string): Promise<UserModel | null> {
    return User.findUnique({
      where: {
        username,
      },
    });
  }
}
