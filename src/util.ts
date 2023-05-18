import { Dispatch } from '@reduxjs/toolkit';
import { HOST } from '../constants';
import { receiveMessage } from './features/mozSlice';
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

export async function httpPut(path: string, payload?: Record<string, any>) {
  const response = await fetch(`${HOST}/${path}`, {
    method: 'PUT',
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

export const apiCaller = async (apiCall: () => Promise<Response>, dispatch?: Dispatch) => {
  const response = await apiCall();

  if (!response.ok) {
    const { error } = await response.json();
    alert(error.message);
    return;
  }

  const data = await extractApiData(response);
  if (!data) return null;
  if (dispatch && data.socket) {
    dispatch(receiveMessage(data.socket));
  }

  return data;
};

async function extractApiData(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function dangerConcat<T>(origin: T[], data: T | T[]) {
  if (Array.isArray(data)) {
    data.forEach((elem) => origin.push(elem));
  } else {
    origin.push(data);
  }
  return;
}

export function downloadFile(content: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${getCurrentDateTime()}.moz`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}
