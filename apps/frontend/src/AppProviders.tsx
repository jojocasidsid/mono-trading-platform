import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import AuthProvider from '@/auth/AuthProvider';
import WebSocketProvider from '@/websocket/WebSocketProvider';

import { Toaster } from '@/components/ui/sonner';
import { queryClient } from './lib/queryClient';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          {children}

          <Toaster position="top-right" richColors />
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
