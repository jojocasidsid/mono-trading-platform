import { AppError, ErrorDetail } from './app_error.js';

export class ConflictError extends AppError {
  constructor(errors: ErrorDetail[]) {
    super(409, errors);
  }
}
