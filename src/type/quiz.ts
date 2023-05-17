export const QuizTypes = {
  CONSONANT: 'consonant',
  MUSIC: 'music',
} as const;

export type QuizType = (typeof QuizTypes)[keyof typeof QuizTypes];

export interface Quiz {
  id?: number;
  type: QuizType;
  question: string;
  answers?: Answer[];
  selected?: boolean;
}

export interface Answer {
  answer: string;
  score: number;
}
