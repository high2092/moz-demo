import { ApiError } from './ApiError';
import { ApiErrorTypeTypes } from './type';

export class RequireAllReadyError extends ApiError {
  constructor() {
    super(ApiErrorTypeTypes.REQUIRE_ALL_READY);
  }
}
