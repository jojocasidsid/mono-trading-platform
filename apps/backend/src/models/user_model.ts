import prisma from '../lib/prisma.js';

import type { UserRole } from '../generated/prisma/enums.js';

export interface CreateUserModel {
  email: string;
  username: string;
  name: string;
  password_hash: string;
  role?: UserRole;
}

export interface SignupUserModel {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface UpdateUserModel {
  email?: string;
  username?: string;
  name?: string;
  password_hash?: string;
  role?: UserRole;
}

const User = prisma.user;

export default User;
