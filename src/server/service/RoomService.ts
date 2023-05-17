import { Room } from '../../type/Room';
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
}

export const roomService = new RoomService();
