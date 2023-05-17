import styled from '@emotion/styled';

const ROOM_SECTION_HEIGHT_PERCENT = 60;

export const Home = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

export const RoomSection = styled.div`
  height: ${ROOM_SECTION_HEIGHT_PERCENT}%;

  overflow: scroll;
`;

export const RoomList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

export const Room = styled.div`
  height: 2rem;
  padding: 1rem;
  margin: 1rem;

  background-color: #e3dffd;
  border-radius: 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ChatSection = styled.div`
  height: ${100 - ROOM_SECTION_HEIGHT_PERCENT}%;

  display: flex;
  flex-direction: column;
`;
