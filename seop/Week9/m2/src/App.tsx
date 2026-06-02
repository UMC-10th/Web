import CartContainer from './components/CartContainer';
import Modal from './components/Modal';
import Navbar from './components/Navbar';
import { useAppSelector } from './store/hooks';

export default function App() {
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar amount={amount} />
      <CartContainer />
      <Modal />
    </div>
  );
}
