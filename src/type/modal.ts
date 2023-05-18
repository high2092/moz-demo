export const ModalTypes = {
  CREATE_QUIZ: 'createQuiz',
  ADD_QUIZ: 'addQuiz',
  QUIZ_LIST: 'quizList',
  CREATE_QUIZ_BUNDLE: 'createQuizBundle',
  CREATE_ROOM: 'createRoom',
} as const;

export type ModalType = (typeof ModalTypes)[keyof typeof ModalTypes];

export interface PreparedModalProps {
  zIndex: number;
}
