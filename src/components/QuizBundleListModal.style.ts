import styled from '@emotion/styled';
import { modalStyle } from '../styles/modalStyle';
import { QUIZ_LIST_MODAL_HEIGHT, QUIZ_LIST_MODAL_WIDTH } from '../constants/style';

export const QuizBundleListModal = styled.div`
  ${modalStyle};

  width: ${QUIZ_LIST_MODAL_WIDTH};
  height: ${QUIZ_LIST_MODAL_HEIGHT};
`;
