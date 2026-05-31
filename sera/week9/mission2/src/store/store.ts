import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import modalReducer from './modalSlice';

// 중앙 저장소 생성. reducer 객체의 key가 state의 최상위 이름이 됨 (state.cart / state.modal)
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,
  },
});

// store 기준으로 타입 추출 → 타입이 적용된 훅에서 재사용
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
