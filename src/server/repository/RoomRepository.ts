import { Room } from '../../type/Room';

class RoomRepository {
  sequence: number;
  rooms: Record<number, Room>;

  constructor() {
    this.sequence = 1;
    this.rooms = {};
  }

  save(room: Room) {
    const id = this.sequence++;
    room.id = id;
    this.rooms[id] = room;
  }

  findById(id: number) {
    return this.rooms[id];
  }

  findAll() {
    return Object.values(this.rooms);
  }
}

export const roomRepository = new RoomRepository();
