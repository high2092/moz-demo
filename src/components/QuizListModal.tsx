import * as S from './QuizListModal.style';
import { closeModal, openModal } from '../features/modalSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { ModalTypes, PreparedModalProps } from '../type/modal';
import { CenteredModal } from './Modal';
import { apiCaller, httpDelete, httpGet } from '../util';
import { editQuiz, removeQuiz, selectAll, setHoveredQuiz, setIsQuizBundleModal, toggleSelectQuiz } from '../features/mozSlice';
import { QuizBundleListModalContent } from './QuizBundleListModal';
import { Quiz, QuizType, QuizTypes } from '../type/quiz';
import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_HEIGHT_PX, MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_WIDTH_PX } from '../constants/style';

export const QuizListModal = ({ zIndex }: PreparedModalProps) => {
  const dispatch = useAppDispatch();
  const { hoveredQuizId } = useAppSelector((state) => state.moz);

  return (
    <CenteredModal
      content={<QuizListModalContent />}
      zIndex={zIndex}
      onClick={() => {
        if (hoveredQuizId === null) dispatch(closeModal());
        else dispatch(setHoveredQuiz(null));
      }}
      handleDimmedClick={() => {}}
    />
  );
};

export const QuizListModalContent = () => {
  const dispatch = useAppDispatch();
  const { quizzes, selectedQuizBundle, hoveredQuizId, isQuizBundleModal } = useAppSelector((state) => state.moz);

  const quizList = selectedQuizBundle?.quizList ?? Object.values(quizzes);
  const hoveredQuiz = quizzes[hoveredQuizId];

  const handleCreateQuizButtonClick = () => {
    dispatch(openModal(ModalTypes.CREATE_QUIZ));
  };

  const handleDeleteButtonClick = async (id: number) => {
    const response = await httpDelete(`api/quiz/${id}`);
    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    dispatch(removeQuiz(id));
  };

  const handleCreateQuizBundleButtonClick = () => {
    if (!quizList.find(({ selected }) => selected)) {
      alert('1개 이상의 퀴즈를 선택해야 해요.');
      return;
    }

    dispatch(openModal(ModalTypes.CREATE_QUIZ_BUNDLE));
  };

  const handleSelectAllButtonClick = () => {
    dispatch(selectAll());
  };

  const handleEditButtonClick = (quiz: Quiz) => {
    dispatch(editQuiz(quiz));
    dispatch(openModal(ModalTypes.CREATE_QUIZ));
  };

  const handleQuizMouseOver = async (e: React.MouseEvent, quiz: Quiz) => {
    e.stopPropagation();
    dispatch(setHoveredQuiz(quiz.id));

    // if (quiz.type !== QuizTypes.MUSIC) return;

    // clearTimeout(timeoutRef.current);
    // timeoutRef.current = setTimeout(async () => {
    //   const { valid, base64Image } = await apiCaller(() => httpGet(`api/validate-video-id?videoId=${quiz.question}`));
    // }, 1000);
  };

  return (
    <S.QuizListModalContainer>
      <div onClick={(e) => e.stopPropagation()}>
        {isQuizBundleModal ? (
          <QuizBundleListModalContent />
        ) : (
          <S.QuizListModal>
            <div style={{ height: '90%', overflow: 'scroll' }}>
              {quizList.map((quiz) => {
                const { id, question, answers, selected } = quiz;
                return (
                  <S.QuizContainer>
                    <S.Quiz selected={selected} onMouseOver={(e) => handleQuizMouseOver(e, quiz)}>
                      <div key={id} onClick={() => dispatch(toggleSelectQuiz(id))}>
                        {id} {question} {answers[0].answer}
                      </div>
                      <div style={{ display: 'flex' }}>
                        <S.DeleteButton onClick={() => handleEditButtonClick(quiz)}>수정</S.DeleteButton>
                        <S.DeleteButton onClick={() => handleDeleteButtonClick(id)}>삭제</S.DeleteButton>
                      </div>
                    </S.Quiz>
                  </S.QuizContainer>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleCreateQuizButtonClick}>퀴즈 생성</button>
              <button onClick={handleSelectAllButtonClick}>전체 선택</button>
              <button onClick={handleCreateQuizBundleButtonClick}>문제집 생성</button>
            </div>
            <button onClick={() => dispatch(setIsQuizBundleModal(true))}>문제집 목록 보기</button>
          </S.QuizListModal>
        )}
      </div>

      <S.QuizInfoModalContainer>{hoveredQuiz && <QuizInfoModal quiz={hoveredQuiz} />}</S.QuizInfoModalContainer>
    </S.QuizListModalContainer>
  );
};

interface QuizInfoModalProps {
  quiz: Quiz;
}

function QuizInfoModal({ quiz }: QuizInfoModalProps) {
  const { type, answers } = quiz;
  return (
    <S.QuizInfoModal onClick={(e) => e.stopPropagation()}>
      <div>타입: {type === QuizTypes.CONSONANT ? '초성' : '뮤직'}</div>
      <S.QuizInfoModalQuestionSection>
        <QuizInfoModalQuestionInfo />
      </S.QuizInfoModalQuestionSection>
      <div style={{ height: '6rem' }}>
        {answers.map(({ answer, score }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{answer}</div>
            <div>{`(${score}점)`}</div>
          </div>
        ))}
      </div>
    </S.QuizInfoModal>
  );
}

function QuizInfoModalQuestionInfo() {
  const { quizzes, hoveredQuizId } = useAppSelector((state) => state.moz);
  const { type, question } = quizzes[hoveredQuizId];

  const [videoId, setVideoId] = useState<string>(null);

  // 과도한 요청 방지
  useEffect(() => {
    setVideoId(null);
    const handle = setTimeout(() => {
      setVideoId(question);
    }, 1000);

    return () => clearTimeout(handle);
  }, [question]);

  switch (type) {
    case QuizTypes.MUSIC: {
      return videoId === null ? <div>Loading...</div> : <YouTube videoId={videoId} opts={{ width: MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_WIDTH_PX, height: MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_HEIGHT_PX }} />;
    }
    case QuizTypes.CONSONANT: {
      return <div>{question}</div>;
    }
    default: {
      return <></>;
    }
  }
}
