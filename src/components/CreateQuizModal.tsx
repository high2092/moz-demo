import { httpPost } from '../util';
import { PreparedModalProps } from '../type/modal';
import { Quiz, QuizType, QuizTypes } from '../type/quiz';
import * as S from './CreateQuizModal.style';
import { CenteredModal } from './Modal';
import { useForm, FieldValues, useFieldArray } from 'react-hook-form';
import { useAppDispatch } from '../store';
import { addQuiz } from '../features/mozSlice';
import { RadioGroup } from './RadioGroup';
import { useState } from 'react';

export const CreateQuizModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<CreateQuizModalContent />} zIndex={zIndex} />;
};

function CreateQuizModalContent() {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'answers' });

  const [quizType, setQuizType] = useState<QuizType>(QuizTypes.CONSONANT);
  const [videoId, setVideoId] = useState('');

  const getQuestion = (type: QuizType, { consonant, videoId }) => {
    switch (type) {
      case QuizTypes.CONSONANT:
        return consonant;
      case QuizTypes.MUSIC:
        return videoId;
    }
  };

  const handleCreateQuiz = async (formData: FieldValues) => {
    const { consonant } = formData;
    const answers = [formData.defaultAnswer, ...formData.answers];
    const quiz: Quiz = { type: quizType, question: getQuestion(quizType, { consonant, videoId }), answers };
    const response = await httpPost('api/quiz', quiz);

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    const { id } = await response.json();

    dispatch(addQuiz({ ...quiz, id }));
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

  return (
    <S.CreateQuizModal>
      <S.CreateQuizForm onSubmit={handleSubmit(handleCreateQuiz)}>
        <RadioGroup
          name="quizType"
          options={[
            { value: QuizTypes.CONSONANT, label: '초성' },
            { value: QuizTypes.MUSIC, label: '음악' },
          ]}
          currentValue={quizType}
          setCurrentValue={(value: QuizType) => setQuizType(value)}
        />
        {quizType === QuizTypes.CONSONANT && <input {...register('consonant')} placeholder="초성" />}
        {quizType === QuizTypes.MUSIC && <input onChange={handleVideoIdInputChange} value={videoId} placeholder="비디오 ID" />}

        <S.AnswerScoreInputRow>
          <input {...register(`defaultAnswer.answer`)} placeholder="정답" />
          <input {...register(`defaultAnswer.score`)} placeholder="점수" />
          <S.AnswerRemoveButton />
        </S.AnswerScoreInputRow>

        {fields.map((field, index) => (
          <div key={`answer-${field.id}`}>
            <S.AnswerScoreInputRow>
              <input {...register(`answers.${index}.answer`)} placeholder={`정답${index + 2}`} />
              <input {...register(`answers.${index}.score`)} placeholder="점수" />
              <S.AnswerRemoveButton>
                <button type="button" onClick={() => remove(index)}>
                  Remove
                </button>
              </S.AnswerRemoveButton>
            </S.AnswerScoreInputRow>
          </div>
        ))}
        <button type="button" onClick={() => append('')}>
          정답 추가
        </button>

        <button>퀴즈 생성</button>
      </S.CreateQuizForm>
    </S.CreateQuizModal>
  );
}
