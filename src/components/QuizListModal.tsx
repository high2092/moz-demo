import * as S from './QuizListModal.style';
import { openModal } from '../features/modalSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { ModalTypes, PreparedModalProps } from '../type/modal';
import { CenteredModal } from './Modal';
import { apiCaller, httpDelete, httpGet } from '../util';
import { editQuiz, removeQuiz, selectAll, setHoveredQuiz, setIsQuizBundleModal, toggleSelectQuiz } from '../features/mozSlice';
import { QuizBundleListModalContent } from './QuizBundleListModal';
import { Quiz, QuizTypes } from '../type/quiz';
import { useEffect, useRef, useState } from 'react';

export const QuizListModal = ({ zIndex }: PreparedModalProps) => {
  const dispatch = useAppDispatch();
  const resetHover = () => dispatch(setHoveredQuiz(null));

  return <CenteredModal content={<QuizListModalContent />} zIndex={zIndex} onMouseOver={resetHover} />;
};

export const QuizListModalContent = () => {
  const dispatch = useAppDispatch();
  const { quizzes, selectedQuizBundle, hoveredQuizId, isQuizBundleModal } = useAppSelector((state) => state.moz);

  const [thumbnailBase64, setThumbnailBase64] = useState('');

  const timeoutRef = useRef<NodeJS.Timeout>(null);

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

    setThumbnailBase64(null);
    if (quiz.type !== QuizTypes.MUSIC) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const { valid, base64Image } = await apiCaller(() => httpGet(`api/validate-video-id?videoId=${quiz.question}`));
      if (valid) setThumbnailBase64(base64Image);
    }, 1000);
  };

  return (
    <S.QuizListModalContainer>
      {isQuizBundleModal ? (
        <QuizBundleListModalContent />
      ) : (
        <S.QuizListModal>
          <div style={{ height: '90%', overflow: 'scroll' }}>
            {quizList.map((quiz) => {
              const { id, question, answers, selected } = quiz;
              return (
                <div style={{ background: selected ? 'orange' : 'initial', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onMouseOver={(e) => handleQuizMouseOver(e, quiz)}>
                  <div key={id} onClick={() => dispatch(toggleSelectQuiz(id))}>
                    {id} {question} {answers[0].answer}
                  </div>
                  <div style={{ display: 'flex' }}>
                    <S.DeleteButton onClick={() => handleEditButtonClick(quiz)}>수정</S.DeleteButton>
                    <S.DeleteButton onClick={() => handleDeleteButtonClick(id)}>삭제</S.DeleteButton>
                  </div>
                </div>
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

      <S.QuizInfoModalContainer>{hoveredQuiz && <QuizInfoModal quiz={hoveredQuiz} thumbnailBase64={thumbnailBase64} />}</S.QuizInfoModalContainer>
    </S.QuizListModalContainer>
  );
};

interface QuizInfoModalProps {
  quiz: Quiz;
  thumbnailBase64: string;
}

function QuizInfoModal({ quiz, thumbnailBase64 }: QuizInfoModalProps) {
  const { type, question, answers } = quiz;
  return (
    <S.QuizInfoModal>
      <div>타입: {type === QuizTypes.CONSONANT ? '초성' : '뮤직'}</div>
      <S.QuizInfoModalQuestionSection>
        {type === QuizTypes.MUSIC ? <div>{thumbnailBase64 === null ? <div>Loading...</div> : <S.MusicQuizInfoThumbnail src={`data:image:jpeg;base64,${thumbnailBase64}`} />}</div> : <div>{question}</div>}
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
