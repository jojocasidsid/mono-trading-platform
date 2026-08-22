import type { FastifyInstance } from 'fastify';

import { add_websocket_client, remove_websocket_client } from '../shared/websocket/websocket.js';

interface WebSocketQuery {
  token?: string;
}

interface AccessTokenPayload {
  user_id: string;
  role: 'TRADER' | 'ADMIN';
}

export async function websocket_routes(app: FastifyInstance): Promise<void> {
  app.get<{
    Querystring: WebSocketQuery;
  }>(
    '/trades',
    {
      websocket: true,
    },
    (socket, request) => {
      const token = request.query.token;

      if (!token) {
        socket.close(1008, 'Authentication required');

        return;
      }

      try {
        const payload = app.jwt.verify<AccessTokenPayload>(token);

        if (!payload.user_id) {
          socket.close(1008, 'Invalid token');

          return;
        }

        add_websocket_client(socket, payload.user_id);

        socket.on('close', () => {
          remove_websocket_client(socket);
        });
      } catch {
        socket.close(1008, 'Invalid or expired token');
      }
    }
  );
}
