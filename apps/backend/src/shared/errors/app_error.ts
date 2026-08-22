export interface ErrorDetail {
  code: string;
  message: string;
  pointer?: string;
}

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errors: ErrorDetail[]
  ) {
    super(errors[0]?.message ?? 'An unexpected error occurred');

    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}
