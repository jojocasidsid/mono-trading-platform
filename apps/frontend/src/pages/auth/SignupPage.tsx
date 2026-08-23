import { Navigate } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import useAuth from '@/hooks/auth/useAuth';
import SignupForm from './components/SignUpForm';

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/trades" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Fusion</h1>

          <p className="mt-2 text-sm text-muted-foreground">Trading platform</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl">Create account</CardTitle>

            <CardDescription>Create your trader account to get started.</CardDescription>
          </CardHeader>

          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
