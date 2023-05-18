import * as S from '../../styles/Room.style';

import { useEffect, useState } from 'react';
import { RoomUserSection } from '../../components/RoomUserSection';
import { QuizRoomMainSection } from '../../components/QuizSection';
import { cutUserListInHalf, httpGet } from '../../util';
import { useAppSelector } from '../../store';
import { useRouter } from 'next/router';

const httpGetRoom = async (id: number) => {
  const response = await httpGet(`api/room/${id}`);

  if (!response.ok) return;

  const userList = await response.json();

  return userList;
};

const ChatRoom = ({ id }) => {
  const router = useRouter();
  const { initialized } = useAppSelector((state) => state.moz);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (!initialized) {
      router.push('/');
      return;
    }
    httpGetRoom(id).then(setUserList);
  }, []);

  if (!initialized) return <></>;

  const [leftUserList, rightUserList] = cutUserListInHalf(userList);

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
