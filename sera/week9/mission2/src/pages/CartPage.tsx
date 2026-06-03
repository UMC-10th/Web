import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { calculateTotals } from '../store/cartSlice';
import CartContainer from '../components/CartContainer';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  // cartItems가 바뀔 때마다(증가/감소/삭제/초기 렌더링) 총 수량·금액 재계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return <CartContainer />;
};

export default CartPage;
