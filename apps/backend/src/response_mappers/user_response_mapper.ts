import type { UserModel } from '../generated/prisma/models.js';

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export function user_response_mapper(user: UserModel): UserResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}
