/** @jsxImportSource @emotion/react */
import * as S from './QuizBundleListModal.style';
import { modalStyle } from '../styles/modalStyle';
import { useAppDispatch, useAppSelector } from '../store';
import { selectQuizBundle, setIsQuizBundleModal } from '../features/mozSlice';

export const QuizBundleListModalContent = () => {
  const dispatch = useAppDispatch();
  const { quizBundles, selectedQuizBundle } = useAppSelector((state) => state.moz);

  return (
    <S.QuizBundleListModal>
      <div style={{ height: '90%', overflow: 'hidden' }}>
        {Object.values(quizBundles).map(({ id, title }) => (
          <div key={`quizBundle-${id}`} style={{ background: id === selectedQuizBundle?.id ? 'orange' : 'initial' }} onClick={() => dispatch(selectQuizBundle(id))}>
            {id} {title}
          </div>
        ))}
      </div>
      <button onClick={() => dispatch(setIsQuizBundleModal(false))}>퀴즈 목록 보기</button>
    </S.QuizBundleListModal>
  );
};
