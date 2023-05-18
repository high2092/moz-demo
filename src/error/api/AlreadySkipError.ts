import { ApiError } from './ApiError';
import { ApiErrorTypeTypes } from './type';

export class AlreadySkipError extends ApiError {
  constructor() {
    super(ApiErrorTypeTypes.ALREADY_SKIP);
  }
}
