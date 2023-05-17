export interface ApiErrorType {
  message: string;
  code: number;
  httpStatus: 200 | 409;
}

export const ApiErrorTypeTypes = {
  ALREADY_PLAYING: 2001,
  EMPTY_QUIZ_LIST: 2002,
  REQUIRE_ALL_READY: 2003,
} as const;

export type ErrorTypeType = (typeof ApiErrorTypeTypes)[keyof typeof ApiErrorTypeTypes];
