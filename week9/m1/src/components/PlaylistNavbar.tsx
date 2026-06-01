import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

const PlaylistNavbar = () => {
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <nav className="sticky top-0 z-20 bg-[#0ECFD3] text-[#063B3D] shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
        <h1 className="text-xl font-bold">UMC Play List</h1>
        <div className="relative" aria-label="cart amount">
          <ShoppingCart size={30} />
          <span className="absolute -right-3 -top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-bold">
            {amount}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default PlaylistNavbar;
