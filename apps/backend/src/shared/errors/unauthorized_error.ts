import { AppError, ErrorDetail } from './app_error.js';

export class UnauthorizedError extends AppError {
  constructor(errors: ErrorDetail[]) {
    super(401, errors);
  }
}
