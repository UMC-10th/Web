import { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import CartContainer from '../components/CartContainer';

const CartPage = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const calculateTotals = useCartStore((state) => state.calculateTotals);

  // cartItems가 바뀔 때마다(증가/감소/삭제/초기 렌더링) 총 수량·금액 재계산
  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return <CartContainer />;
};

export default CartPage;
