import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { mozSlice } from './features/mozSlice';
import { modalSlice } from './features/modalSlice';

export const store = configureStore({
  reducer: {
    moz: mozSlice.reducer,
    modal: modalSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
