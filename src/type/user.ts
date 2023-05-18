export interface User {
  id?: number;
  name: string;

  roomId?: number;
  isReady?: boolean;
  score: number;
}
