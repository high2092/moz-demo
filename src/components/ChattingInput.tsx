import { useRef, useState } from 'react';
import { sendMessage } from '../util';
import { useAppSelector } from '../store';

export const ChattingInput = () => {
  const { socket } = useAppSelector((state) => state.moz);

  const [chattingInputValue, setChattingInputValue] = useState('');

  const handleChattingInputChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setChattingInputValue(target.value);
  };

  const handleChattingInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (chattingInputValue.length === 0) return;
    if (e.nativeEvent.isComposing) return;

    sendMessage({ type: 'chat/local', body: chattingInputValue }, socket);

    setChattingInputValue('');
  };

  return <input style={{ width: '100%' }} value={chattingInputValue} onChange={handleChattingInputChange} onKeyDown={handleChattingInputKeyDown} />;
};
