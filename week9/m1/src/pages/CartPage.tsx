import { useEffect } from 'react';
import CartContainer from '../components/CartContainer';
import Modal from '../components/Modal';
import PlaylistNavbar from '../components/PlaylistNavbar';
import { useCartStore } from '../store/useCartStore';

const CartPage = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const calculateTotals = useCartStore((state) => state.calculateTotals);
  const isModalOpen = useCartStore((state) => state.isModalOpen);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <div className="min-h-dvh bg-slate-50">
      <PlaylistNavbar />
      <CartContainer />
      {isModalOpen && <Modal />}
    </div>
  );
};

export default CartPage;
