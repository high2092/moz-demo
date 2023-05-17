import { ApiError } from './ApiError';
import { ApiErrorTypeTypes } from './type';

export class AlreadyPlayingError extends ApiError {
  constructor() {
    super(ApiErrorTypeTypes.ALREADY_PLAYING);
  }
}
