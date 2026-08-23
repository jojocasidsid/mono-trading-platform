import { useMutation } from '@tanstack/react-query';

import type { LoginRequest } from '@fusion/shared';

import { login } from '@/api/authApi';

import useAuth from './useAuth';

export default function useLogin() {
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (input: LoginRequest) => login(input),

    onSuccess: user => {
      setUser(user);
    },
  });
}
