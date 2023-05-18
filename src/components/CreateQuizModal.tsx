import { apiCaller, httpPost, httpPut } from '../util';
import { PreparedModalProps } from '../type/modal';
import { Quiz, QuizType, QuizTypes } from '../type/quiz';
import * as S from './CreateQuizModal.style';
import { CenteredModal } from './Modal';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../store';
import { addQuiz } from '../features/mozSlice';
import { RadioGroup } from './RadioGroup';
import { useEffect, useState } from 'react';

export const CreateQuizModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<CreateQuizModalContent />} zIndex={zIndex} />;
};

function CreateQuizModalContent() {
  const dispatch = useAppDispatch();
  const { editingQuiz } = useAppSelector((state) => state.moz);
  const { register, handleSubmit, control, setValue } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'answers' });

  const [quizType, setQuizType] = useState<QuizType>(QuizTypes.CONSONANT);
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    if (editingQuiz) {
      setQuizType(editingQuiz.type);

      setValue('consonant', editingQuiz.question);
      setVideoId(editingQuiz.question);
      editingQuiz.answers.forEach(({ answer, score }) => append({ answer, score }));
    } else {
      append({ answer: '', score: 5 });
    }
  }, []);

  const getQuestion = (type: QuizType, { consonant, videoId }) => {
    switch (type) {
      case QuizTypes.CONSONANT:
        return consonant;
      case QuizTypes.MUSIC:
        return videoId;
    }
  };

  const handleCreateQuiz = async (formData: FieldValues) => {
    const { consonant, answers } = formData;
    const quiz: Quiz = { type: quizType, question: getQuestion(quizType, { consonant, videoId }), answers };

    if (editingQuiz) {
      const { id } = editingQuiz;
      await apiCaller(() => httpPut(`api/quiz/${id}`, quiz));
      dispatch(addQuiz({ ...quiz, id }));
      alert('저장되었습니다.');
    } else {
      const { id } = await apiCaller(() => httpPost('api/quiz', quiz));
      dispatch(addQuiz({ ...quiz, id }));
    }
  };

  const handleVideoIdInputChange = (e: React.ChangeEvent) => {
    const regex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const target = e.target as HTMLInputElement;
    let videoId = target.value;

    const match = videoId.match(regex);

    if (match) {
      videoId = match[1];
      target.value = videoId;
    }

    setVideoId(videoId);
  };

  const handleAddAnswerButtonClick = () => {
    const MAX_ANSWER_COUNT = 5;
    if (fields.length === MAX_ANSWER_COUNT) {
      alert('정답은 최대 5개까지만 설정할 수 있어요.');
      return;
    }
    append({ answer: '', score: 5 });
  };

  return (
    <S.CreateQuizModal>
      <S.CreateQuizForm onSubmit={handleSubmit(handleCreateQuiz)}>
        <RadioGroup
          style={{ display: 'flex' }}
          name="quizType"
          options={[
            { value: QuizTypes.CONSONANT, label: '초성' },
            { value: QuizTypes.MUSIC, label: '음악' },
          ]}
          currentValue={quizType}
          setCurrentValue={(value: QuizType) => setQuizType(value)}
          disabled={!!editingQuiz}
        />

        {quizType === QuizTypes.CONSONANT && <input {...register('consonant')} placeholder="초성" />}
        {quizType === QuizTypes.MUSIC && <input onChange={handleVideoIdInputChange} value={videoId} placeholder="비디오 ID" />}

        <S.AnswerSection>
          {fields.map((field, index) => (
            <div key={`answer-${field.id}`}>
              <S.AnswerScoreInputRow>
                <input {...register(`answers.${index}.answer`)} placeholder={`정답${index + 1}`} />
                <input {...register(`answers.${index}.score`)} placeholder="점수" />

                {index === 0 ? (
                  <button type="button" onClick={handleAddAnswerButtonClick}>
                    정답 추가
                  </button>
                ) : (
                  <S.AnswerRemoveButton>
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </S.AnswerRemoveButton>
                )}
              </S.AnswerScoreInputRow>
            </div>
          ))}
        </S.AnswerSection>

        <button>{editingQuiz ? '저장' : '퀴즈 생성'}</button>
      </S.CreateQuizForm>
    </S.CreateQuizModal>
  );
}
