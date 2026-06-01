import CartContainer from './components/CartContainer';
import Modal from './components/Modal';
import Navbar from './components/Navbar';
import { usePlaylistStore } from './store/usePlaylistStore';

export default function App() {
  const amount = usePlaylistStore((state) => state.amount);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar amount={amount} />
      <CartContainer />
      <Modal />
    </div>
  );
}
