import { HOST } from '../constants';
import { SocketPayload, SocketPayloadType } from './type/socket';
import { User } from './type/user';

export function cutUserListInHalf(users: User[]) {
  return [users.filter((user, idx) => idx % 2 === 0), users.filter((user, idx) => idx % 2 === 1)];
}

export function convertPayloadToChat({ type, body, from }: SocketPayload) {
  switch (type) {
    case 'chat/local': {
      return `${from}: ${body}`;
    }

    case 'system': {
      return `[system] ${body}`;
    }

    default: {
      return `[${type}] ${from}: ${body}`;
    }
  }
}

export function createSocketPayload(type: SocketPayloadType, body: string, from?: string): SocketPayload {
  return { type, body, from };
}

export async function httpGet(path: string) {
  const response = await fetch(`${HOST}/${path}`, { method: 'GET', credentials: 'include' });
  return response;
}

export async function httpPost(path: string, payload?: Record<string, any>) {
  const response = await fetch(`${HOST}/${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload ?? {}),
  });
  return response;
}

export async function httpDelete(path: string) {
  const response = await fetch(`${HOST}/${path}`, { method: 'DELETE', credentials: 'include' });
  return response;
}
