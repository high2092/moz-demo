import { Quiz } from './quiz';
import { User } from './user';

type UserId = number;

export interface Room {
  id?: number;
  name: string;
  capacity: number;
  users: User[];
  quizList: Quiz[];
  status: 'wait' | 'playing';
  round?: number;
  skipVoting: UserId[];
}
