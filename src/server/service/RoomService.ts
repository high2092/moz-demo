import { Room } from '../../type/Room';
import { roomRepository } from '../repository/RoomRepository';

class RoomService {
  createRoom(name: string, capacity: number) {
    const room: Room = { name, capacity, users: [] };
    roomRepository.save(room);
    return room.id;
  }

  findRoom(id: number) {
    return roomRepository.findById(id);
  }
}

export const roomService = new RoomService();
