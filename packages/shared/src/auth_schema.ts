import { z } from 'zod';

export const login_schema = z.object({
  email: z.email('Invalid email address.'),

  password: z.string().min(1, 'Password is required.'),
});

export const signup_schema = z.object({
  email: z.email('Invalid email address.'),

  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(50, 'Username must not exceed 50 characters.'),

  name: z.string().min(1, 'Name is required.').max(100, 'Name must not exceed 100 characters.'),

  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export type LoginRequest = z.infer<typeof login_schema>;

export type SignupRequest = z.infer<typeof signup_schema>;
