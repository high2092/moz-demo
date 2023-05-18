import { Room } from '../../type/Room';
import { Quiz, QuizTypes } from '../../type/quiz';
import { SocketPayload, SocketPayloadTypes } from '../../type/socket';
import { createSocketPayload } from '../../util';
import { createRoomInfo, getCurrentRoundQuiz } from './room';

export function createRoundInfoSocketPayloads(room: Room) {
  const quiz = getCurrentRoundQuiz(room);

  const payloads: SocketPayload[] = [];
  payloads.push(createSocketPayload(SocketPayloadTypes.SYSTEM, `라운드 ${room.round} 시작!`));
  payloads.push(createSocketPayload(getRoundInfoPayloadType(quiz), quiz.question));
  payloads.push(createRoomInfoSocketPayload(room));
  return payloads;
}

function getRoundInfoPayloadType(quiz: Quiz) {
  switch (quiz.type) {
    case QuizTypes.MUSIC: {
      return SocketPayloadTypes.MUSIC_QUIZ;
    }
    default: {
      return SocketPayloadTypes.ROUND_INFO;
    }
  }
}

export function createRoomInfoSocketPayload(room: Room) {
  return createSocketPayload(SocketPayloadTypes.ROOM_INFO, JSON.stringify(createRoomInfo(room)));
}
