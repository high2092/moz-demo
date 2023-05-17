import { Room } from '../../type/Room';

export function getCurrentRoundQuiz(room: Room) {
  return room.quizList[room.round - 1];
}
