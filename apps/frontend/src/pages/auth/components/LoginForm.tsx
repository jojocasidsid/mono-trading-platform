import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { Link, useNavigate } from 'react-router-dom';

import { login_schema, type LoginRequest } from '@fusion/shared';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import useLogin from '@/hooks/auth/useLogin';

import { applyApiErrors } from '@/lib/apiErrors';

export default function LoginForm() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(login_schema),

    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(input: LoginRequest): void {
    loginMutation.mutate(input, {
      onSuccess: () => {
        toast.success('Welcome back.');

        navigate('/trades', {
          replace: true,
        });
      },

      onError: error => {
        applyApiErrors({
          error,
          setError,
          fallbackMessage: 'Unable to log in.',
        });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="trader@example.com"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />

        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />

        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
