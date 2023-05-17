import { ApiErrorTypes } from './ApiErrors';
import { ErrorTypeType } from './type';

export class ApiError extends Error {
  message: string;
  code: number;
  httpStatus: number;

  constructor(errorTypeType: ErrorTypeType) {
    const { message, code, httpStatus } = ApiErrorTypes[errorTypeType];
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
  }
}
