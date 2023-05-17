import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ModalType } from '../type/modal';

interface ModalState {
  modals: ModalType[];
}

const initialState: ModalState = {
  modals: [],
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalType>) {
      state.modals.push(action.payload);
    },

    closeModal(state) {
      state.modals.pop();
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
