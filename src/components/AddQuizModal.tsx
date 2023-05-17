import * as S from './AddQuizModal.style';
import { PreparedModalProps } from '../type/modal';
import { CenteredModal } from './Modal';
import { useAppSelector } from '../store';
import { useState } from 'react';
import { Quiz } from '../type/quiz';
import { httpPost } from '../util';

export const AddQuizModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<AddQuizModalContent />} zIndex={zIndex} />;
};

interface AddQuiz {
  id?: number;
  quizList?: Quiz[];
}

function AddQuizModalContent() {
  const { quizzes, quizBundles } = useAppSelector((state) => state.moz);
  const [addQuizList, setAddQuizList] = useState<AddQuiz[]>([]);

  const handleQuizClick = (quiz: AddQuiz) => {
    setAddQuizList((addQuizList) => addQuizList.concat(quiz));
  };

  const handleApplyButtonClick = async () => {
    const quizList = addQuizList.reduce((acc, { id, quizList }) => {
      if (quizList) return acc.concat(quizList.map(({ id }) => id));
      return acc.concat(id);
    }, []);

    const response = await httpPost('api/game/add-quiz', { quizList });

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }
  };

  return (
    <S.AddQuizModal>
      <div style={{ display: 'flex', width: '30vw' }}>
        <div style={{ flex: 1, height: '60vh', overflow: 'scroll' }}>
          <h1>문제</h1>
          <div>
            {Object.values(quizzes).map((quiz) => {
              const { id, question, answers } = quiz;
              return (
                <div key={`quiz-${id}`} onClick={() => handleQuizClick(quiz)}>
                  {id} {question} {answers[0].answer}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, height: '60vh', overflow: 'scroll' }}>
          <h1>문제집</h1>
          <div>
            {Object.values(quizBundles).map((quizBundle) => {
              const { id, title } = quizBundle;
              return (
                <div key={`quizBundle-${id}`} onClick={() => handleQuizClick(quizBundle)}>
                  {title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <hr />
      <div style={{ display: 'flex' }}>
        {addQuizList.map(({ id, quizList }) => (
          <div key={`addQuiz-${id}`} style={{ margin: '0 2px', background: quizList ? 'orange' : 'yellow' }}>
            {id}
          </div>
        ))}
      </div>
      <button onClick={handleApplyButtonClick}>적용</button>
    </S.AddQuizModal>
  );
}
