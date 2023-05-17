import { Room } from '../../type/Room';
import { SocketPayload, SocketPayloadTypes } from '../../type/socket';
import { createSocketPayload } from '../../util';
import { getCurrentRoundQuiz } from './room';

export function createRoundInfoSocketPayloads(room: Room) {
  const { question } = getCurrentRoundQuiz(room);

  const payloads: SocketPayload[] = [];
  payloads.push(createSocketPayload(SocketPayloadTypes.SYSTEM, `라운드 ${room.round} 시작!`));
  payloads.push(createSocketPayload(SocketPayloadTypes.ROUND_INFO, question));
  return payloads;
}
