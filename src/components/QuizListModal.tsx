import * as S from './QuizListModal.style';
import { openModal } from '../features/modalSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { ModalTypes, PreparedModalProps } from '../type/modal';
import { CenteredModal } from './Modal';
import { httpDeleteApi } from '../util';
import { removeQuiz, selectAll, toggleSelectQuiz } from '../features/mozSlice';
import { QuizBundleListModalContent } from './QuizBundleListModal';

export const QuizListModal = ({ zIndex }: PreparedModalProps) => {
  return (
    <CenteredModal
      content={
        <div style={{ display: 'flex' }}>
          <QuizListModalContent />
          <QuizBundleListModalContent />
        </div>
      }
      zIndex={zIndex}
    />
  );
};

export const QuizListModalContent = () => {
  const dispatch = useAppDispatch();
  const { quizzes, selectedQuizBundle } = useAppSelector((state) => state.moz);

  const quizList = selectedQuizBundle?.quizList ?? Object.values(quizzes);

  const handleCreateQuizButtonClick = () => {
    dispatch(openModal(ModalTypes.CREATE_QUIZ));
  };

  const handleDeleteButtonClick = async (id: number) => {
    const response = await httpDeleteApi(`quiz/${id}`);
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

  return (
    <S.QuizListModal>
      <div style={{ height: '60vh', overflow: 'scroll' }}>
        {quizList.map((quiz) => {
          const { id, question, answers, selected } = quiz;
          return (
            <div style={{ background: selected ? 'orange' : 'initial', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div key={id} onClick={() => dispatch(toggleSelectQuiz(id))}>
                {id} {question} {answers[0].answer}
              </div>
              <S.DeleteButton onClick={() => handleDeleteButtonClick(id)}>삭제</S.DeleteButton>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handleCreateQuizButtonClick}>퀴즈 생성</button>
        <button onClick={handleSelectAllButtonClick}>전체 선택</button>
        <button onClick={handleCreateQuizBundleButtonClick}>문제집 생성</button>
      </div>
    </S.QuizListModal>
  );
};
