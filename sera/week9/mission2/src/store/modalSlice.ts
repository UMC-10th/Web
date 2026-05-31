import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
}

// 모달 열림/닫힘 상태만 관리 (useState 대신 전역 상태로 제어)
const initialState: ModalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
