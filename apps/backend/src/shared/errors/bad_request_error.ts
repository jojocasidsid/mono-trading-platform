import { AppError, ErrorDetail } from './app_error.js';

export class BadRequestError extends AppError {
  constructor(errors: ErrorDetail[]) {
    super(400, errors);
  }
}
