import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { ZodError } from 'zod';

import { AppError } from '../errors/app_error.js';

export default function ErrorHandler(
  error: FastifyError | AppError | ZodError,
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

  if (error instanceof ZodError) {
    void reply.status(400).send({
      errors: error.issues.map(issue => ({
        code: 'VALIDATION_ERROR',
        message: issue.message,

        ...(issue.path.length > 0 && {
          pointer: issue.path.join('.'),
        }),
      })),
    });

    return;
  }

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
