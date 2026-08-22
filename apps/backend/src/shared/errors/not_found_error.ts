import { AppError, ErrorDetail } from './app_error.js';

export class NotFoundError extends AppError {
  constructor(errors: ErrorDetail[]) {
    super(404, errors);
  }
}
