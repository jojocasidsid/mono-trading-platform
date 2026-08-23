import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { WebSocketContext, type WebSocketStatus } from './WebSocketContext';

import { handleWebSocketEvent } from './websocketEventHandler';
import useAuth from '@/hooks/auth/useAuth';

interface WebSocketProviderProps {
  children: ReactNode;
}

const webSocketUrl = import.meta.env.VITE_WS_URL;

if (!webSocketUrl) {
  throw new Error('VITE_WS_URL is required');
}

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuth();

  const [status, setStatus] = useState<WebSocketStatus>('DISCONNECTED');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      setStatus('CONNECTED');
    };

    socket.onmessage = event => {
      if (typeof event.data !== 'string') {
        return;
      }

      handleWebSocketEvent(event.data, queryClient);
    };

    socket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      setStatus('DISCONNECTED');
    };

    return () => {
      socket.close();
    };
  }, [isAuthenticated, queryClient]);

  const connectionStatus: WebSocketStatus =
    isAuthenticated && status === 'DISCONNECTED' ? 'CONNECTING' : status;

  const value = useMemo(
    () => ({
      status: connectionStatus,

      isConnected: connectionStatus === 'CONNECTED',
    }),
    [connectionStatus]
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
