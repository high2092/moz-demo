import { AlreadySkipError } from '../../error/api/AlreadySkipError';
import { NotPlayingError } from '../../error/api/NotPlayingError';
import { Room } from '../../type/Room';
import { SocketPayload, SocketPayloadTypes } from '../../type/socket';
import { User } from '../../type/user';
import { createSocketPayload, dangerConcat } from '../../util';
import { roomRepository } from '../repository/RoomRepository';
import { getCurrentRoundQuiz } from '../utils/room';
import { createRoundInfoSocketPayloads } from '../utils/socket';
import { trim } from '../utils/string';

const ROUND_SKIP_THRESHOLD = 5;
class GameService {
  compare(room: Room, answer: string, member: User) {
    const score = calculateScore(room, answer);
    member.score += score;

    const payloads: SocketPayload[] = [];

    if (score !== 0) {
      if (score >= ROUND_SKIP_THRESHOLD) {
        dangerConcat(payloads, createSocketPayload(SocketPayloadTypes.SYSTEM, `${member.name}님 ${score}점 획득! (정답: ${answer})`));
        dangerConcat(payloads, this.skipRound(room));
      } else {
        dangerConcat(payloads, createSocketPayload(SocketPayloadTypes.SYSTEM, `${member.name}님 ${score}점 획득!`));
      }
    }

    return payloads;
  }

  private skipRound(room: Room) {
    if (room.round === room.quizList.length) {
      return this.gameOver(room);
    }
    room.round++;
    return createRoundInfoSocketPayloads(room);
  }

  private gameOver(room: Room) {
    room.status = 'wait';
    room.round = null;
    room.users.forEach((user) => (user.isReady = false));
    return createSocketPayload(SocketPayloadTypes.GAME_OVER, '모든 라운드가 종료되었습니다.', 'system');
  }

  voteSkip(member: User) {
    const payloads: SocketPayload[] = [];
    const room = roomRepository.findById(member.roomId);
    if (room.skipVoting.findIndex((userId) => userId === member.id) !== -1) throw new AlreadySkipError();
    if (room.status !== 'playing') throw new NotPlayingError();
    room.skipVoting.push(member.id);

    if (room.skipVoting.length === room.users.length) {
      room.skipVoting = [];
      payloads.push(createSocketPayload(SocketPayloadTypes.SYSTEM, `만장일치로 현재 라운드를 스킵합니다. (정답: ${getCurrentRoundQuiz(room).answers[0].answer})`));
      dangerConcat(payloads, this.skipRound(room));
    }

    return payloads;
  }
}

function calculateScore(room: Room, userAnswer: string) {
  const { answers } = getCurrentRoundQuiz(room);
  for (const { score, answer } of answers) {
    if (trim(userAnswer) === trim(answer)) return score;
  }
  return 0;
}

export const gameService = new GameService();
