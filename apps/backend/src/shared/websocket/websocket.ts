import type WebSocket from 'ws';

import type { WebSocketEvent, WebSocketMessage } from './websocket_events.js';

interface WebSocketClient {
  socket: WebSocket;
  trader_id: string;
}

const clients = new Set<WebSocketClient>();

export function add_websocket_client(socket: WebSocket, trader_id: string): void {
  clients.add({
    socket,
    trader_id,
  });
}

export function remove_websocket_client(socket: WebSocket): void {
  for (const client of clients) {
    if (client.socket === socket) {
      clients.delete(client);

      break;
    }
  }
}

export function broadcast_to_trader<T>(trader_id: string, event: WebSocketEvent, data: T): void {
  const message: WebSocketMessage<T> = {
    event,
    data,
  };

  const payload = JSON.stringify(message);

  for (const client of clients) {
    if (client.trader_id === trader_id && client.socket.readyState === 1) {
      client.socket.send(payload);
    }
  }
}

export function get_connected_trader_ids(): string[] {
  return [...new Set(Array.from(clients).map(client => client.trader_id))];
}

export function broadcast_to_all<T>(event: WebSocketEvent, data: T): void {
  const message: WebSocketMessage<T> = {
    event,
    data,
  };

  const payload = JSON.stringify(message);

  for (const client of clients) {
    if (client.socket.readyState === 1) {
      client.socket.send(payload);
    }
  }
}
