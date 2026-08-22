import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '../errors/app_error.js';

export default function ErrorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.error(
    {
      err: error,
      method: request.method,
      url: request.url,
      requestId: request.id,
      body: request.body,
      params: request.params,
      query: request.query,
    },
    'Request failed'
  );

  if (error instanceof AppError) {
    void reply.status(error.statusCode).send({
      errors: error.errors,
    });

    return;
  }

  void reply.status(500).send({
    errors: [
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
    ],
  });
}
