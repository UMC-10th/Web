import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

const getTotals = (items: CartItems) => {
  let amount = 0;
  let total = 0;

  items.forEach((item) => {
    amount += item.amount;
    total += item.amount * Number(item.price);
  });

  return { amount, total };
};

const initialTotals = getTotals(cartItems);

const initialState: CartState = {
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const updateTotals = (state: CartState) => {
  const totals = getTotals(state.cartItems);
  state.amount = totals.amount;
  state.total = totals.total;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload.id,
      );

      if (item) {
        item.amount += 1;
        updateTotals(state);
      }
    },
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload.id,
      );

      if (item) {
        item.amount -= 1;
        updateTotals(state);
      }
    },
    remove: (state, action: PayloadAction<{ id: string }>) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id,
      );
      updateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      updateTotals(state);
    },
  },
});

export const { increase, decrease, remove, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
