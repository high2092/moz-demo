import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { createSocketPayload, httpPost, socketCaller } from '../util';

export const ChattingInput = () => {
  const { socket } = useAppSelector((state) => state.moz);
  const dispatch = useAppDispatch();

  const [chattingInputValue, setChattingInputValue] = useState('');

  const handleChattingInputChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setChattingInputValue(target.value);
  };

  const handleChattingInputKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (chattingInputValue.length === 0) return;
    if (e.nativeEvent.isComposing) return;

    await socketCaller(() => httpPost('api/socket', createSocketPayload('chat/local', chattingInputValue)), dispatch);

    setChattingInputValue('');
  };

  return <input style={{ width: '100%' }} value={chattingInputValue} onChange={handleChattingInputChange} onKeyDown={handleChattingInputKeyDown} />;
};
