import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import * as S from './QuizSection.style';
import { convertPayloadToChat, httpPost, apiCaller } from '../util';
import { setIsReady } from '../features/mozSlice';
import { openModal } from '../features/modalSlice';
import { ModalTypes } from '../type/modal';
import { Quiz, QuizTypes } from '../type/quiz';
import YouTube from 'react-youtube';
import { ChattingInput } from './ChattingInput';

export const QuizRoomMainSection = () => {
  const dispatch = useAppDispatch();
  const { chatList, currentRoundQuiz, myProfile, roomInfo } = useAppSelector((state) => state.moz);
  const chattingBoxRef = useRef(null);

  const me = roomInfo ? roomInfo.users.find((user) => user.id === myProfile.id) : undefined;

  useEffect(() => {
    const chattingBox = chattingBoxRef.current;
    if (chattingBox) {
      chattingBox.scrollTop = chattingBox.scrollHeight;
    }
  }, [chatList]);

  const handleAddQuizButtonClick = () => {
    dispatch(openModal(ModalTypes.ADD_QUIZ));
  };

  const handleStartButtonClick = async () => {
    apiCaller(() => httpPost('api/game/start'), dispatch);
  };

  const handleSkipButtonClick = async () => {
    apiCaller(() => httpPost('api/game/skip'), dispatch);
  };

  return (
    <S.QuizRoomMainSection>
      <S.QuizRoomMainSectionTop>
        <button onClick={handleStartButtonClick}>게임 시작</button>
        <ReadyButton />
        <button onClick={handleAddQuizButtonClick}>문제 추가</button>
        <button onClick={handleSkipButtonClick}>스킵 투표</button>
      </S.QuizRoomMainSectionTop>
      <QuizSection quiz={currentRoundQuiz} />
      {roomInfo && (
        <div>
          <div>현재 라운드: {`${roomInfo.currentRound} / ${roomInfo.totalRound}`}</div>
          <div>내 점수: {me?.score}</div>
        </div>
      )}
      <S.ChattingSection>
        <S.ChattingBox ref={chattingBoxRef}>
          {chatList.map((chat, idx) => (
            <div key={`chat-${idx}`}>{convertPayloadToChat(chat)}</div>
          ))}
        </S.ChattingBox>
        <div>
          <ChattingInput />
        </div>
      </S.ChattingSection>
    </S.QuizRoomMainSection>
  );
};

interface QuizSectionProps {
  quiz?: Quiz;
}

function QuizSection({ quiz }: QuizSectionProps) {
  if (quiz === null) return <S.QuizSection />;

  switch (quiz.type) {
    case QuizTypes.MUSIC: {
      return (
        <S.QuizSection>
          <div>재생되는 음악을 듣고 정답을 맞혀주세요</div>
          <YouTube style={{ display: 'none' }} videoId={quiz.question} opts={{ playerVars: { autoplay: 1 } }} onEnd={(e) => e.target.playVideo()} />
        </S.QuizSection>
      );
    }
    default: {
      return <S.QuizSection>{quiz.question}</S.QuizSection>;
    }
  }
}

function ReadyButton() {
  const dispatch = useAppDispatch();
  const { isReady } = useAppSelector((state) => state.moz);

  const handleReadyButtonClick = async () => {
    const response = await httpPost('api/game/ready');

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    const { ready } = await response.json();
    dispatch(setIsReady(ready));
  };

  return <button onClick={handleReadyButtonClick}>{isReady ? 'UNREADY' : 'READY'}</button>;
}
