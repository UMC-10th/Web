// 장바구니에 담기는 음반 하나의 정보 구조
export interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string; // Mock 데이터가 문자열이라 string으로 두고, 계산 시 Number로 변환
  img: string;
  amount: number; // 담은 수량
}

// cartSlice가 관리하는 전역 상태 구조
export interface CartState {
  cartItems: CartItem[];
  amount: number; // 전체 수량
  total: number; // 전체 금액
}
