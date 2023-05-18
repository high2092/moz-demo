import * as S from '../styles/index.style';
import { useEffect, useRef, useState } from 'react';
import { openModal } from '../features/modalSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { ModalTypes } from '../type/modal';
import { apiCaller, convertPayloadToChat, downloadFile, httpGet, httpPost } from '../util';
import { fetchProfile, fetchQuiz, fetchQuizBundleList, initSocket, receiveMessage } from '../features/mozSlice';
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
  const { chatList, myProfile } = useAppSelector((state) => state.moz);
  const router = useRouter();

  const [roomList, setRoomList] = useState([]);

  const loadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    httpGetRoomList().then(setRoomList);
    httpGetQuizList().then((quizList) => dispatch(fetchQuiz(quizList)));
    httpGetQuizBundleList().then((quizBundleList) => dispatch(fetchQuizBundleList(quizBundleList)));
    apiCaller(() => httpGet('api/user/me')).then(({ profile }) => dispatch(fetchProfile(profile)));
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

  const handleExtractButtonClick = async () => {
    const { quizList } = await apiCaller(() => httpGet('api/quiz'));

    const { quizBundleList } = await apiCaller(() => httpGet('api/quiz-bundle'));

    const payload = {
      quizList: quizList.map(({ type, question, answers }) => ({ type, question, answers })),
      quizBundleList: quizBundleList.map(({ title, quizList }) => ({ title, quizList })),
    };

    const { result } = await apiCaller(() => httpPost('api/export', payload));
    downloadFile(result);
  };

  const handleFileInputChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files[0];

    const reader = new FileReader();
    reader.onload = async () => {
      const { result } = await apiCaller(() => httpPost('api/import', { cipher: reader.result }));
      const data = await apiCaller(() => httpPost('api/load', result));
      if (data !== undefined) {
        httpGetQuizList().then((quizList) => dispatch(fetchQuiz(quizList)));
        httpGetQuizBundleList().then((quizBundleList) => dispatch(fetchQuizBundleList(quizBundleList)));
      }
    };
    reader.readAsText(file);
  };

  return (
    <S.Home>
      <div style={{ display: 'flex' }}>
        <h1>MOZ</h1>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>{myProfile?.name}</div>
        <button onClick={handleRoomCreateButtonClick}>방 만들기</button>
        <button onClick={() => dispatch(openModal(ModalTypes.QUIZ_LIST))}>퀴즈 관리</button>
        <button onClick={handleExtractButtonClick}>코드 생성</button>
        <button onClick={() => loadInputRef.current?.click()}>불러오기</button>
        <input ref={loadInputRef} id="load" type="file" onChange={handleFileInputChange} hidden />
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
