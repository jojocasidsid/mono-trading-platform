import type { LoginRequest, SignupRequest } from '@fusion/shared';

import type { User } from '@/types/auth';

import { apiClient } from './apiClient';

interface UserResponse {
  data: User;
}

export async function login(input: LoginRequest): Promise<User> {
  const response = await apiClient.post<UserResponse>('/api/auth/login', input);

  return response.data.data;
}

export async function signup(input: SignupRequest): Promise<User> {
  const response = await apiClient.post<UserResponse>('/api/auth/signup', input);

  return response.data.data;
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<UserResponse>('/api/auth/me');

  return response.data.data;
}
