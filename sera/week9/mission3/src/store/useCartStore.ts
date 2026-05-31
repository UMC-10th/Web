import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItem } from '../types/cart';

// 하나의 store 안에 장바구니 상태 + 모달 상태 + 액션을 모두 묶어둠
interface CartStore {
  // ----- 상태 -----
  cartItems: CartItem[];
  amount: number; // 전체 수량
  total: number; // 전체 금액
  isOpen: boolean; // 모달 열림 여부

  // ----- 장바구니 액션 -----
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // ----- 모달 액션 -----
  openModal: () => void;
  closeModal: () => void;
}

// Redux의 reducer 로직을 set((state) => { ... }) 형태로 옮김
export const useCartStore = create<CartStore>((set) => ({
  // 초기값: Mock 데이터를 그대로 사용 (amount/total은 calculateTotals로 계산)
  cartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  // 수량 증가: id가 일치하는 아이템만 +1
  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      ),
    })),

  // 수량 감소: -1 후 1 미만이 되면 목록에서 제거
  decrease: (id) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount >= 1),
    })),

  // 아이템 제거: id가 일치하는 아이템만 삭제
  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  // 전체 삭제: 목록 비우기 (amount/total은 calculateTotals로 0이 됨)
  clearCart: () => set({ cartItems: [] }),

  // 전체 합계 계산: 모든 아이템 기준으로 수량/금액 재계산
  calculateTotals: () =>
    set((state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      return { amount, total };
    }),

  // 모달 열기 / 닫기
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
