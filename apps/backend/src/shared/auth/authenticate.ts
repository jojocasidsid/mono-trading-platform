import type { FastifyReply, FastifyRequest } from 'fastify';

export default async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({
      errors: [
        {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required.',
        },
      ],
    });
  }
}
