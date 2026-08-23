import { createContext } from 'react';

export type WebSocketStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export interface WebSocketContextValue {
  status: WebSocketStatus;
  isConnected: boolean;
}

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);
