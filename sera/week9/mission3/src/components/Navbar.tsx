import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  // store에서 필요한 값(전체 수량)만 selector로 꺼내옴
  const amount = useCartStore((state) => state.amount);

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
