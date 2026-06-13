import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItemType } from '../constants/cartItems';

// 합계 계산 헬퍼 (Redux의 calculateTotals 로직과 동일)
const calcTotals = (items: CartItemType[]) =>
  items.reduce(
    (acc, item) => ({
      amount: acc.amount + item.amount,
      total: acc.total + item.amount * parseInt(item.price),
    }),
    { amount: 0, total: 0 }
  );

// ─── 타입 정의 ────────────────────────────────────────────────
interface CartStore {
  // 장바구니 상태
  cartItems: CartItemType[];
  amount: number;
  total: number;

  // 모달 상태
  isModalOpen: boolean;

  // 장바구니 액션
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // 모달 액션
  openModal: () => void;
  closeModal: () => void;
}

// ─── Zustand 스토어 ───────────────────────────────────────────
export const useCartStore = create<CartStore>((set) => ({
  // 초기값: Redux cartSlice의 initialState와 동일한 구조
  cartItems,
  ...calcTotals(cartItems),
  isModalOpen: false,

  // increase: 특정 아이템 수량 +1 → 합계 즉시 재계산
  increase: (id) =>
    set((state) => {
      const cartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      return { cartItems, ...calcTotals(cartItems) };
    }),

  // decrease: 특정 아이템 수량 -1 → 1 미만이면 자동 제거 → 합계 재계산
  decrease: (id) =>
    set((state) => {
      const cartItems = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0);
      return { cartItems, ...calcTotals(cartItems) };
    }),

  // removeItem: 특정 아이템 완전 제거 → 합계 재계산
  removeItem: (id) =>
    set((state) => {
      const cartItems = state.cartItems.filter((item) => item.id !== id);
      return { cartItems, ...calcTotals(cartItems) };
    }),

  // clearCart: 전체 삭제 + 모달 닫기
  clearCart: () =>
    set({ cartItems: [], amount: 0, total: 0, isModalOpen: false }),

  // calculateTotals: 수동으로도 호출 가능 (Redux 패턴과의 호환성 유지)
  calculateTotals: () =>
    set((state) => calcTotals(state.cartItems)),

  // 모달 열기 / 닫기
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
