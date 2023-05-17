import styled from '@emotion/styled';

export const QuizRoomMainSection = styled.div`
  width: 100%;
  height: 100%;
  background: #dddddd;

  border-radius: 16px;

  display: flex;
  flex-direction: column;

  & > * {
    margin: 1rem;
  }
`;

export const QuizRoomMainSectionTop = styled.div`
  background: green;

  display: flex;
`;

export const QuizSection = styled.div`
  flex: 2;

  background-color: aliceblue;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChattingSection = styled.div`
  flex: 1;

  padding: 1rem;

  background-color: orange;
`;

export const ChattingBox = styled.div`
  height: 30vh;
  overflow: scroll;
`;
