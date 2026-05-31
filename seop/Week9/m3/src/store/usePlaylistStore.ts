import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItem } from '../types/cart';

interface PlaylistState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  isOpen: boolean;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  open: () => void;
  close: () => void;
}

const getTotals = (items: CartItem[]) =>
  items.reduce(
    (totals, item) => {
      totals.amount += item.amount;
      totals.total += Number(item.price) * item.amount;
      return totals;
    },
    { amount: 0, total: 0 },
  );

const withTotals = (items: CartItem[]) => {
  const { amount, total } = getTotals(items);
  return { cartItems: items, amount, total };
};

const initialCartItems = cartItems.map((item) => ({ ...item }));
const initialTotals = getTotals(initialCartItems);

export const usePlaylistStore = create<PlaylistState>((set) => ({
  cartItems: initialCartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,
  increase: (id) =>
    set((state) =>
      withTotals(
        state.cartItems.map((item) =>
          item.id === id ? { ...item, amount: item.amount + 1 } : item,
        ),
      ),
    ),
  decrease: (id) =>
    set((state) =>
      withTotals(
        state.cartItems
          .map((item) =>
            item.id === id ? { ...item, amount: item.amount - 1 } : item,
          )
          .filter((item) => item.amount > 0),
      ),
    ),
  removeItem: (id) =>
    set((state) => withTotals(state.cartItems.filter((item) => item.id !== id))),
  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),
  calculateTotals: () =>
    set((state) => {
      const { amount, total } = getTotals(state.cartItems);
      return { amount, total };
    }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
