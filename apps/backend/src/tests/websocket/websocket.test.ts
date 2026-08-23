import { beforeEach, describe, expect, it, vi } from 'vitest';

import type WebSocket from 'ws';
import {
  add_websocket_client,
  broadcast_to_all,
  broadcast_to_trader,
  remove_websocket_client,
} from '../../shared/websocket/websocket.js';

function create_socket(): WebSocket {
  return {
    readyState: 1,
    send: vi.fn(),
  } as unknown as WebSocket;
}

describe('websocket', () => {
  const sockets: WebSocket[] = [];

  beforeEach(() => {
    for (const socket of sockets) {
      remove_websocket_client(socket);
    }

    sockets.length = 0;
  });

  function register_client(trader_id: string) {
    const socket = create_socket();

    sockets.push(socket);

    add_websocket_client(socket, trader_id);

    return socket;
  }

  describe('broadcast_to_trader', () => {
    it('sends a message to the matching trader', () => {
      const socket = register_client('trader-1');

      broadcast_to_trader('trader-1', 'TRADE_CREATED', {
        id: 'trade-1',
        symbol: 'AAPL',
      });

      expect(socket.send).toHaveBeenCalledTimes(1);

      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: 'TRADE_CREATED',
          data: {
            id: 'trade-1',
            symbol: 'AAPL',
          },
        })
      );
    });

    it('does not send a message to another trader', () => {
      const traderOne = register_client('trader-1');
      const traderTwo = register_client('trader-2');

      broadcast_to_trader('trader-1', 'TRADE_UPDATED', {
        id: 'trade-1',
      });

      expect(traderOne.send).toHaveBeenCalledTimes(1);

      expect(traderTwo.send).not.toHaveBeenCalled();
    });

    it('sends to all connections belonging to the same trader', () => {
      const firstTab = register_client('trader-1');
      const secondTab = register_client('trader-1');
      const otherTrader = register_client('trader-2');

      broadcast_to_trader('trader-1', 'TRADE_UPDATED', {
        id: 'trade-1',
      });

      expect(firstTab.send).toHaveBeenCalledTimes(1);
      expect(secondTab.send).toHaveBeenCalledTimes(1);

      expect(otherTrader.send).not.toHaveBeenCalled();
    });
  });

  describe('broadcast_to_all', () => {
    it('sends the message to every connected trader', () => {
      const traderOne = register_client('trader-1');
      const traderTwo = register_client('trader-2');

      broadcast_to_all('MARKET_PRICE_UPDATED', {
        symbol: 'AAPL',
        price: 110,
        previous_price: 109,
      });

      expect(traderOne.send).toHaveBeenCalledTimes(1);
      expect(traderTwo.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove_websocket_client', () => {
    it('stops sending messages after a client is removed', () => {
      const socket = register_client('trader-1');

      remove_websocket_client(socket);

      broadcast_to_trader('trader-1', 'TRADE_CREATED', {
        id: 'trade-1',
      });

      expect(socket.send).not.toHaveBeenCalled();
    });
  });

  describe('socket state', () => {
    it('does not send messages to a socket that is not open', () => {
      const socket = {
        readyState: 3,
        send: vi.fn(),
      } as unknown as WebSocket;

      sockets.push(socket);

      add_websocket_client(socket, 'trader-1');

      broadcast_to_trader('trader-1', 'TRADE_CREATED', {
        id: 'trade-1',
      });

      expect(socket.send).not.toHaveBeenCalled();
    });
  });
});
