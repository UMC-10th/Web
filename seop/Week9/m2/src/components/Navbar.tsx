import { ShoppingCart } from 'lucide-react';

interface NavbarProps {
  amount: number;
}

export default function Navbar({ amount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 bg-slate-800 text-white shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <h1 className="text-2xl font-extrabold tracking-tight">UMC Play List</h1>
        <div className="flex items-center gap-2 rounded-full bg-slate-700 px-4 py-2">
          <ShoppingCart aria-hidden="true" size={24} />
          <span className="text-xl font-bold">{amount}</span>
        </div>
      </div>
    </header>
  );
}
