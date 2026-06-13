import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function Navbar() {
  const { amount } = useSelector((state: RootState) => state.cart);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">🎵 UMC Play List</h1>

        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          {amount > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {amount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
