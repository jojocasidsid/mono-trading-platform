import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getMe } from '@/api/authApi';

import type { User } from '@/types/auth';

import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      try {
        const currentUser = await getMe();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      setUser,
      logout,
    }),
    [user, isLoading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
