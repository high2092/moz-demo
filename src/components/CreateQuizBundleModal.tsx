import * as S from './CreateQuizBundleModal.style';
import { useAppDispatch, useAppSelector } from '../store';
import { PreparedModalProps } from '../type/modal';
import { CenteredModal } from './Modal';
import { apiCaller, httpPost } from '../util';
import { FieldValues, useForm } from 'react-hook-form';
import { addQuizBundle } from '../features/mozSlice';

export const CreateQuizBundleModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<CreateQuizBundleModalContent />} zIndex={zIndex} />;
};

function CreateQuizBundleModalContent() {
  const dispatch = useAppDispatch();
  const { quizzes } = useAppSelector((state) => state.moz);
  const { register, handleSubmit } = useForm();

  const selectedQuizList = Object.values(quizzes).filter(({ selected }) => selected); // TODO: createSelector

  const handleQuizCreateQuizBundle = async ({ title }: FieldValues) => {
    const id = await apiCaller(() => httpPost('api/quiz-bundle', { title, quizzes: selectedQuizList.map(({ id }) => id) }));
    dispatch(addQuizBundle({ id, title, quizList: selectedQuizList }));
  };

  return (
    <S.CreateQuizBundleModal>
      <form onSubmit={handleSubmit(handleQuizCreateQuizBundle)} style={{ display: 'flex' }}>
        <div>
          <input {...register('title')} placeholder="문제집 이름" />
          <div>
            {selectedQuizList[0].answers[0].answer} 외 {selectedQuizList.length - 1}개
          </div>
        </div>
        <button>만들기</button>
      </form>
    </S.CreateQuizBundleModal>
  );
}
