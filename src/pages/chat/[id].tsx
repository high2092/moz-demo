import * as S from '../../styles/Room.style';

import { useEffect, useState } from 'react';
import { RoomUserSection } from '../../components/RoomUserSection';
import { QuizRoomMainSection } from '../../components/QuizSection';
import { cutUserListInHalf, httpGet } from '../../util';

const httpGetRoom = async (id: number) => {
  const response = await httpGet(`api/room/${id}`);

  if (!response.ok) return;

  const userList = await response.json();

  return userList;
};

const ChatRoom = ({ id }) => {
  const [userList, setUserList] = useState([]);

  const [leftUserList, rightUserList] = cutUserListInHalf(userList);

  useEffect(() => {
    httpGetRoom(id).then(setUserList);
  }, []);

  return (
    <S.QuizRoomPage>
      <RoomUserSection users={leftUserList} />
      <QuizRoomMainSection />
      <RoomUserSection users={rightUserList} />
    </S.QuizRoomPage>
  );
};

export const getServerSideProps = ({ params: { id } }) => {
  return {
    props: { id },
  };
};

export default ChatRoom;
