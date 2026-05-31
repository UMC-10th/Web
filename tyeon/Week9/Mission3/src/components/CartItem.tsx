import { useCartStore } from '../store/useCartStore';
import type { CartItemType } from '../constants/cartItems';

export default function CartItem({ id, title, singer, price, img, amount }: CartItemType) {
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
      {/* 앨범 커버 */}
      <img
        src={img}
        alt={title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 shadow-sm"
      />

      {/* 음반 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{singer}</p>
        <p className="text-sm font-bold text-indigo-600 mt-1">
          {parseInt(price).toLocaleString('ko-KR')}원
        </p>
      </div>

      {/* 수량 조절 */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <button
          onClick={() => increase(id)}
          className="w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
          aria-label="수량 증가"
        >
          +
        </button>
        <span className="text-sm font-bold text-gray-700 w-6 text-center">{amount}</span>
        <button
          onClick={() => decrease(id)}
          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
          aria-label="수량 감소"
        >
          −
        </button>
      </div>

      {/* 개별 삭제 */}
      <button
        onClick={() => removeItem(id)}
        className="ml-2 text-gray-300 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
        aria-label="항목 삭제"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
