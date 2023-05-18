import styled from '@emotion/styled';
import { modalStyle } from '../styles/modalStyle';

export const CreateQuizModal = styled.div`
  ${modalStyle};
`;

export const CreateQuizForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const AnswerSection = styled.div`
  height: 7rem;

  overflow: scroll;
`;

export const AnswerScoreInputRow = styled.div`
  display: flex;
`;

export const AnswerRemoveButton = styled.div`
  width: 4.1rem;
`;
