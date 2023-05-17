import { Quiz } from './quiz';

export interface QuizBundle {
  id?: number;
  title: string;
  quizList: Quiz[];
}
