import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItem } from '../types/cart';

interface CartStore {
  cartItems: CartItem[];
  amount: number;
  total: number;
  isModalOpen: boolean;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const getTotals = (items: CartItem[]) =>
  items.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.total += item.amount * item.price;
      return acc;
    },
    { amount: 0, total: 0 },
  );

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems,
  amount: 0,
  total: 0,
  isModalOpen: false,
  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      ),
    })),
  decrease: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount > 0),
    })),
  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ cartItems: [], isModalOpen: false }),
  calculateTotals: () => {
    const { amount, total } = getTotals(get().cartItems);
    set({ amount, total });
  },
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
