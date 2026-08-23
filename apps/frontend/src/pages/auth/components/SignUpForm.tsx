import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { Link, useNavigate } from 'react-router-dom';

import { signup_schema, type SignupRequest } from '@fusion/shared';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import useSignup from '@/hooks/auth/useSignup';

import { applyApiErrors } from '@/lib/apiErrors';

export default function SignupForm() {
  const navigate = useNavigate();

  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupRequest>({
    resolver: zodResolver(signup_schema),

    defaultValues: {
      email: '',
      username: '',
      name: '',
      password: '',
    },
  });

  function onSubmit(input: SignupRequest): void {
    signupMutation.mutate(input, {
      onSuccess: () => {
        toast.success('Account created successfully. You can now sign in.');

        navigate('/login', {
          replace: true,
        });
      },

      onError: error => {
        applyApiErrors({
          error,
          setError,
          fallbackMessage: 'Unable to create your account.',
        });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input
          id="name"
          autoComplete="name"
          placeholder="John Smith"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />

        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>

        <Input
          id="username"
          autoComplete="username"
          placeholder="jsmith"
          aria-invalid={Boolean(errors.username)}
          {...register('username')}
        />

        {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
      </div>

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
          autoComplete="new-password"
          placeholder="Create a password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />

        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
        {signupMutation.isPending ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
