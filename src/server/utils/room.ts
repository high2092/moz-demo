import { Room, RoomDto } from '../../type/Room';

export function getCurrentRoundQuiz(room: Room) {
  return room.quizList[room.round - 1];
}

export function createRoomInfo(room: Room): RoomDto {
  const { users, round, quizList, skipVoting } = room;
  const roomInfo: RoomDto = { users, currentRound: round, totalRound: quizList.length, skipVotingCount: skipVoting.length };
  return roomInfo;
}
