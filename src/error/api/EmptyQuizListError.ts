import { ApiError } from './ApiError';
import { ApiErrorTypeTypes } from './type';

export class EmptyQuizListError extends ApiError {
  constructor() {
    super(ApiErrorTypeTypes.EMPTY_QUIZ_LIST);
  }
}
