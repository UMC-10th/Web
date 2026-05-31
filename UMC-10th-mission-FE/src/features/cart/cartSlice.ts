import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';
import type { CartState } from '../../types/cart';

const initialState: CartState = {
  cartItems,
  amount: cartItems.length,
  total: cartItems.reduce((sum, item) => sum + Number(item.price) * item.amount, 0),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) item.amount += 1;
    },
    decrease(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) {
        item.amount -= 1;
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
        }
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals(state) {
      state.amount = state.cartItems.reduce((sum, item) => sum + item.amount, 0);
      state.total = state.cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.amount,
        0
      );
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
