import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

const Navbar = () => {
  // 전역 상태에서 전체 수량을 읽어와 뱃지로 표시
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <nav className="sticky top-0 z-10 bg-violet-600 text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">UMC Play List</h1>

        <div className="relative">
          <ShoppingCart size={28} />
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-violet-900">
            {amount}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
