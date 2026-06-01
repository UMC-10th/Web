import { useEffect } from 'react';
import CartContainer from '../components/CartContainer';
import Modal from '../components/Modal';
import PlaylistNavbar from '../components/PlaylistNavbar';
import { calculateTotals } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const isModalOpen = useAppSelector((state) => state.modal.isOpen);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="min-h-dvh bg-slate-50">
      <PlaylistNavbar />
      <CartContainer />
      {isModalOpen && <Modal />}
    </div>
  );
};

export default CartPage;
