import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import * as S from './QuizSection.style';
import { convertPayloadToChat, httpPost, sendMessage } from '../util';
import { ready, unready } from '../features/mozSlice';
import { openModal } from '../features/modalSlice';
import { ModalTypes } from '../type/modal';
import { Quiz, QuizTypes } from '../type/quiz';
import YouTube from 'react-youtube';
import { ChattingInput } from './ChattingInput';

export const QuizRoomMainSection = () => {
  const dispatch = useAppDispatch();
  const { chatList, isReady, currentRoundQuiz } = useAppSelector((state) => state.moz);
  const chattingBoxRef = useRef(null);

  useEffect(() => {
    const chattingBox = chattingBoxRef.current;
    if (chattingBox) {
      chattingBox.scrollTop = chattingBox.scrollHeight;
    }
  }, [chatList]);

  const handleAddQuizButtonClick = () => {
    dispatch(openModal(ModalTypes.ADD_QUIZ));
  };

  return (
    <S.QuizRoomMainSection>
      <S.QuizRoomMainSectionTop>
        {isReady ? <UnreadyButton /> : <ReadyButton />}
        <button onClick={handleAddQuizButtonClick}>문제 추가</button>
      </S.QuizRoomMainSectionTop>
      <QuizSection quiz={currentRoundQuiz} />
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

  const handleReadyButtonClick = async () => {
    const response = await httpPost('api/game/ready');

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    dispatch(ready());
  };

  return <button onClick={handleReadyButtonClick}>READY</button>;
}

function UnreadyButton() {
  const dispatch = useAppDispatch();

  const handleUnreadyButtonClick = async () => {
    const response = await httpPost('api/game/unready');

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    dispatch(unready());
  };

  return <button onClick={handleUnreadyButtonClick}>UNREADY</button>;
}
