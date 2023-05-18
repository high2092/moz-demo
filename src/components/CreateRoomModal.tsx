/** @jsxImportSource @emotion/react */
import { FieldValues, useForm } from 'react-hook-form';
import { closeModal } from '../features/modalSlice';
import { addRoom, fetchRoomList } from '../features/mozSlice';
import { useAppDispatch } from '../store';
import { modalStyle } from '../styles/modalStyle';
import { PreparedModalProps } from '../type/modal';
import { apiCaller, httpPost } from '../util';
import { CenteredModal } from './Modal';

export function CreateRoomModal({ zIndex }: PreparedModalProps) {
  return <CenteredModal content={<CreateRoomModalContent />} zIndex={zIndex} />;
}

function CreateRoomModalContent() {
  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm();

  const handleCreateRoom = async ({ name }: FieldValues) => {
    const roomProfile = { name, capacity: 4 };

    const id = await apiCaller(() => httpPost('api/room', roomProfile));
    dispatch(addRoom({ ...roomProfile, id }));
    dispatch(closeModal());
  };

  return (
    <div css={modalStyle}>
      <form onSubmit={handleSubmit(handleCreateRoom)}>
        <input {...register('name')} placeholder="방 제목" />
        <button>생성</button>
      </form>
    </div>
  );
}
