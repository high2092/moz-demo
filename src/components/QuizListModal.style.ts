import styled from '@emotion/styled';
import { modalStyle } from '../styles/modalStyle';
import { MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_HEIGHT_REM, MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_WIDTH_REM, QUIZ_INFO_MODAL_CONTAINER_WIDTH_REM, QUIZ_INFO_MODAL_WIDTH_REM, QUIZ_LIST_MODAL_HEIGHT, QUIZ_LIST_MODAL_WIDTH } from '../constants/style';

export const QuizListModalContainer = styled.div`
  display: flex;

  transform: translateX(calc(${QUIZ_INFO_MODAL_CONTAINER_WIDTH_REM}rem / 2));
`;

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

export const QuizInfoModalContainer = styled.div`
  width: ${QUIZ_INFO_MODAL_CONTAINER_WIDTH_REM}rem;

  margin-left: 1rem;
`;

export const QuizInfoModal = styled.div`
  ${modalStyle};

  width: ${QUIZ_INFO_MODAL_WIDTH_REM}rem;
`;

export const QuizInfoModalQuestionSection = styled.div`
  width: ${MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_WIDTH_REM}rem;
  height: ${MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_HEIGHT_REM}rem;
  padding-bottom: 1rem;
`;

export const MusicQuizInfoThumbnail = styled.img`
  width: ${MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_WIDTH_REM}rem;
  height: ${MUSIC_QUIZ_INFO_MODAL_THUMBNAIL_HEIGHT_REM}rem;
`;
