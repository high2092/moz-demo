/** @jsxImportSource @emotion/react */
import { modalStyle } from '../styles/modalStyle';
import { useAppDispatch, useAppSelector } from '../store';
import { selectQuizBundle } from '../features/mozSlice';

export const QuizBundleListModalContent = () => {
  const dispatch = useAppDispatch();
  const { quizBundles, selectedQuizBundle } = useAppSelector((state) => state.moz);

  return (
    <div css={modalStyle}>
      <div>
        {Object.values(quizBundles).map(({ id, title }) => (
          <div key={`quizBundle-${id}`} style={{ background: id === selectedQuizBundle?.id ? 'orange' : 'initial' }} onClick={() => dispatch(selectQuizBundle(id))}>
            {id} {title}
          </div>
        ))}
      </div>
    </div>
  );
};
