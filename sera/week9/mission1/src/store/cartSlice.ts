import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../constants/cartItems';
import type { CartState } from '../types/cart';

// 초기 상태: Mock 데이터를 cartItems로, 수량/금액은 0에서 시작
// (앱 첫 렌더링 시 calculateTotals를 dispatch해서 자동 계산되도록 함)
const initialState: CartState = {
  cartItems,
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 수량 증가: payload(id)와 일치하는 아이템만 +1
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) item.amount += 1;
    },

    // 수량 감소: -1 했을 때 1 미만이 되면 목록에서 제거
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.amount === 1) {
        state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      } else {
        item.amount -= 1;
      }
    },

    // 아이템 제거: payload(id)와 일치하는 아이템만 완전히 삭제
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
    },

    // 전체 삭제: 목록 비우기 (amount/total은 calculateTotals로 0이 됨)
    clearCart: (state) => {
      state.cartItems = [];
    },

    // 전체 합계 계산: 수량/금액을 모든 아이템 기준으로 다시 계산
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
