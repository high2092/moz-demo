import { ApiError } from './ApiError';
import { ApiErrorTypeTypes } from './type';

export class NotPlayingError extends ApiError {
  constructor() {
    super(ApiErrorTypeTypes.NOT_PLAYING);
  }
}
