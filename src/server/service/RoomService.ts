import { Room } from '../../type/Room';
import { memberRepository } from '../repository/MemberRepository';
import { quizRepository } from '../repository/QuizRepository';
import { roomRepository } from '../repository/RoomRepository';

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

  checkAllReady(id: number) {
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
}

export const roomService = new RoomService();
