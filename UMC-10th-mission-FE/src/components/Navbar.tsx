import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export default function Navbar() {
  const amount = useSelector((state: RootState) => state.cart.amount);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-bold tracking-wide">🎵 UMC Playlist</h1>
      <div className="relative">
        <span className="text-2xl">🛒</span>
        {amount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {amount}
          </span>
        )}
      </div>
    </nav>
  );
}
