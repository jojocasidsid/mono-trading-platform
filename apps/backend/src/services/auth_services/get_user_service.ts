import type { UserModel } from '../../generated/prisma/models.js';

import UserRepository from '../../repositories/user_repository.js';
import { NotFoundError } from '../../shared/errors/not_found_error.js';

export default class GetUserService {
  private readonly user_repository = new UserRepository();

  async execute(user_id: string): Promise<UserModel> {
    const user = await this.user_repository.find_by_id(user_id);

    if (!user) {
      throw new NotFoundError([
        {
          code: 'USER_NOT_FOUND',
          message: 'User not found.',
        },
      ]);
    }

    return user;
  }
}
