import styled from '@emotion/styled';
import { modalStyle } from '../styles/modalStyle';
import { QUIZ_LIST_MODAL_HEIGHT, QUIZ_LIST_MODAL_WIDTH } from '../constants/style';

export const QuizListModal = styled.div`
  ${modalStyle};

  width: ${QUIZ_LIST_MODAL_WIDTH};
  height: ${QUIZ_LIST_MODAL_HEIGHT};
`;

export const DeleteButton = styled.div`
  color: #820000;
  font-size: 0.8rem;

  cursor: pointer;
`;
