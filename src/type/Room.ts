import { Quiz } from './quiz';
import { User } from './user';

export interface Room {
  id?: number;
  name: string;
  capacity: number;
  users: User[];
  quizList: Quiz[];
  status: 'wait' | 'playing';
}
