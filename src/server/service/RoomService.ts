import { Room } from '../../type/Room';
import { SocketPayload, SocketPayloadTypes } from '../../type/socket';
import { dangerConcat, createSocketPayload } from '../../util';
import { RequireAllReadyError } from '../../error/api/RequireAllReadyError';
import { memberRepository } from '../repository/MemberRepository';
import { quizRepository } from '../repository/QuizRepository';
import { roomRepository } from '../repository/RoomRepository';
import { AlreadyPlayingError } from '../../error/api/AlreadyPlayingError';
import { EmptyQuizListError } from '../../error/api/EmptyQuizListError';

class RoomService {
  createRoom(name: string, capacity: number) {
    const room: Room = { name, capacity, users: [], quizList: [], status: 'wait' };
    roomRepository.save(room);
    return room.id;
  }

  findRoom(id: number) {
    return roomRepository.findById(id);
  }

  addQuizzes(id: number, quizIdList: number[]) {
    const room = roomRepository.findById(id);
    const quizList = quizIdList.map((id) => quizRepository.findById(id));
    room.quizList = room.quizList.concat(quizList).sort((a, b) => Math.random() - 0.5);
  }

  private checkAllReady(id: number) {
    const room = roomRepository.findById(id);
    for (const { isReady } of room.users) {
      if (!isReady) return false;
    }
    return true;
  }

  enter(id: number, memberId: number) {
    const room = roomRepository.findById(id);
    const member = memberRepository.findById(memberId);

    member.roomId = id;
    member.isReady = false;
    if (!room.users.find(({ id }) => id === memberId)) room.users.push(member);
  }

  gameStart(id: number) {
    const room = roomRepository.findById(id);

    if (!this.checkAllReady(id)) throw new RequireAllReadyError();
    if (room.status !== 'wait') throw new AlreadyPlayingError();
    if (room.quizList.length === 0) throw new EmptyQuizListError();

    room.round = 1;
    room.status = 'playing';

    const payloads: SocketPayload[] = [];
    dangerConcat(payloads, createSocketPayload(SocketPayloadTypes.SYSTEM, '게임 시작!'));
    dangerConcat(payloads, createRoundInfoSocketPayloads(room));
    return payloads;
  }
}

function getCurrentRounQuiz(room: Room) {
  return room.quizList[room.round - 1];
}

function createRoundInfoSocketPayloads(room: Room) {
  const { question } = getCurrentRounQuiz(room);

  const payloads: SocketPayload[] = [];
  payloads.push(createSocketPayload(SocketPayloadTypes.SYSTEM, `라운드 ${room.round} 시작!`));
  payloads.push(createSocketPayload(SocketPayloadTypes.ROUND_INFO, question));
  return payloads;
}

export const roomService = new RoomService();
