import { useMutation } from '@tanstack/react-query';

import type { SignupRequest } from '@fusion/shared';

import { signup } from '@/api/authApi';

export default function useSignup() {
  return useMutation({
    mutationFn: (input: SignupRequest) => signup(input),
  });
}
