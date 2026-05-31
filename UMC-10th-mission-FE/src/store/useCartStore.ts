import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItem } from '../types/cart';

interface CartStore {
  cartItems: CartItem[];
  amount: number;
  total: number;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

const useCartStore = create<CartStore>((set) => ({
  cartItems,
  amount: cartItems.length,
  total: cartItems.reduce((sum, item) => sum + Number(item.price) * item.amount, 0),

  increase: (id) =>
    set((state) => {
      const updated = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      const amount = updated.reduce((sum, item) => sum + item.amount, 0);
      const total = updated.reduce((sum, item) => sum + Number(item.price) * item.amount, 0);
      return { cartItems: updated, amount, total };
    }),

  decrease: (id) =>
    set((state) => {
      const updated = state.cartItems
        .map((item) => (item.id === id ? { ...item, amount: item.amount - 1 } : item))
        .filter((item) => item.amount > 0);
      const amount = updated.reduce((sum, item) => sum + item.amount, 0);
      const total = updated.reduce((sum, item) => sum + Number(item.price) * item.amount, 0);
      return { cartItems: updated, amount, total };
    }),

  removeItem: (id) =>
    set((state) => {
      const updated = state.cartItems.filter((item) => item.id !== id);
      const amount = updated.reduce((sum, item) => sum + item.amount, 0);
      const total = updated.reduce((sum, item) => sum + Number(item.price) * item.amount, 0);
      return { cartItems: updated, amount, total };
    }),

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () =>
    set((state) => ({
      amount: state.cartItems.reduce((sum, item) => sum + item.amount, 0),
      total: state.cartItems.reduce((sum, item) => sum + Number(item.price) * item.amount, 0),
    })),
}));

export default useCartStore;
