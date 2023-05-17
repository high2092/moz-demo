export const SocketPayloadTypes = {
  LOCAL_CHAT: 'chat/local',
  SYSTEM: 'system',
  ROUND_INFO: 'roundInfo',
  MUSIC_QUIZ: 'quiz/music',
  GAME_OVER: 'gameOver',
} as const;

export type SocketPayloadType = (typeof SocketPayloadTypes)[keyof typeof SocketPayloadTypes];

export interface SocketPayload {
  type: SocketPayloadType;
  body: string;
  from?: string;
}
