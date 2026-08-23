import type { FastifyInstance } from 'fastify';

import { add_websocket_client, remove_websocket_client } from '../shared/websocket/websocket.js';

interface JwtUser {
  user_id: string;
  role: string;
  token_type: 'access' | 'refresh';
}

export async function websocket_routes(app: FastifyInstance): Promise<void> {
  app.get(
    '/',
    {
      websocket: true,
    },
    async (socket, request) => {
      try {
        await request.jwtVerify();

        const user = request.user as JwtUser;

        if (user.token_type !== 'access') {
          socket.close(1008, 'Unauthorized');

          return;
        }

        add_websocket_client(socket, user.user_id);

        app.log.info(
          {
            trader_id: user.user_id,
          },
          'WebSocket client connected'
        );

        socket.on('close', () => {
          remove_websocket_client(socket);

          app.log.info(
            {
              trader_id: user.user_id,
            },
            'WebSocket client disconnected'
          );
        });

        socket.on('error', error => {
          app.log.error(
            {
              err: error,
              trader_id: user.user_id,
            },
            'WebSocket client error'
          );
        });
      } catch (error) {
        app.log.warn(
          {
            err: error,
          },
          'WebSocket authentication failed'
        );

        socket.close(1008, 'Unauthorized');
      }
    }
  );
}
