import * as S from '../styles/index.style';
import { useEffect, useState } from 'react';
import { openModal } from '../features/modalSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { ModalTypes } from '../type/modal';
import { convertPayloadToChat, httpGet, httpPost } from '../util';
import { fetchQuiz, fetchQuizBundleList, initSocket, receiveMessage } from '../features/mozSlice';
import { useRouter } from 'next/router';
import { ChattingInput } from '../components/ChattingInput';

const httpGetRoomList = async () => {
  const response = await httpGet('api/room');
  const { rooms } = await response.json();

  return rooms;
};

const httpGetQuizList = async () => {
  const response = await httpGet('api/quiz');
  if (!response.ok) {
    console.error(response.statusText);
    return null;
  }

  const { quizList } = await response.json();
  return quizList;
};

async function httpGetQuizBundleList() {
  const response = await httpGet('api/quiz-bundle');
  if (!response.ok) {
    console.error(response.statusText);
    return null;
  }

  const { quizBundleList } = await response.json();
  return quizBundleList;
}

const Home = () => {
  const dispatch = useAppDispatch();
  const { socket, chatList } = useAppSelector((state) => state.moz);
  const router = useRouter();

  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    httpGetRoomList().then(setRoomList);
  }, []);

  useEffect(() => {
    httpGetQuizList().then((quizList) => dispatch(fetchQuiz(quizList)));
  }, []);

  useEffect(() => {
    httpGetQuizBundleList().then((quizBundleList) => dispatch(fetchQuizBundleList(quizBundleList)));
  }, []);

  const handleRoomCreateButtonClick = async () => {
    const roomProfile = {
      name: '아무나',
      capacity: 4,
    };

    const response = await httpPost('api/room', roomProfile);

    if (!response.ok) {
      return;
    }

    const id = await response.json();

    setRoomList((roomList) => roomList.concat({ ...roomProfile, id }));
  };

  const handleRoomClick = (id: number) => {
    if (!roomList.find((room) => room.id === id).requirePassword) {
      router.push(`/chat/${id}`);
    }
  };

  return (
    <S.Home>
      <div style={{ display: 'flex' }}>
        <h1>MOZ</h1>
        <button onClick={handleRoomCreateButtonClick}>방 만들기</button>
        <button onClick={() => dispatch(openModal(ModalTypes.QUIZ_LIST))}>퀴즈 관리</button>
      </div>
      <div style={{ flexGrow: 1 }}>
        <S.RoomSection>
          <S.RoomList>
            {roomList.map(({ id, name }) => (
              <S.Room key={`room-${id}`} onClick={() => handleRoomClick(id)}>
                <div>{id}</div>
                <div>{name}</div>
              </S.Room>
            ))}
          </S.RoomList>
        </S.RoomSection>
        <S.ChatSection>
          <div style={{ flexGrow: 1, background: '#dddddd', overflow: 'scroll' }}>
            {chatList.map((chat, idx) => (
              <div key={`chat-${idx}`}>{convertPayloadToChat(chat)}</div>
            ))}
          </div>
          <ChattingInput />
        </S.ChatSection>
      </div>
    </S.Home>
  );
};

export default Home;
