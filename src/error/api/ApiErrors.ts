import { ApiErrorTypeTypes, ApiErrorType, ErrorTypeType } from './type';

type ErrorTypeEnum = {
  [key in ErrorTypeType]: ApiErrorType;
};

export const ApiErrorTypes: ErrorTypeEnum = {
  [ApiErrorTypeTypes.ALREADY_PLAYING]: {
    message: '이미 게임이 진행중이에요.',
    code: ApiErrorTypeTypes.ALREADY_PLAYING,
    httpStatus: 409,
  },

  [ApiErrorTypeTypes.EMPTY_QUIZ_LIST]: {
    message: '문제 목록이 비어 있어요.',
    code: ApiErrorTypeTypes.EMPTY_QUIZ_LIST,
    httpStatus: 409,
  },

  [ApiErrorTypeTypes.REQUIRE_ALL_READY]: {
    message: '준비가 완료되지 않은 유저가 있어요.',
    code: ApiErrorTypeTypes.REQUIRE_ALL_READY,
    httpStatus: 409,
  },
};
