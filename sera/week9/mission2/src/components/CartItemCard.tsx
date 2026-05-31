import { Minus, Plus } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { increase, decrease, removeItem } from '../store/cartSlice';
import type { CartItem } from '../types/cart';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
  const dispatch = useAppDispatch();
  const { id, title, singer, price, img, amount } = item;

  return (
    <li className="flex items-center gap-4 border-b border-gray-200 py-4">
      <img
        src={img}
        alt={title}
        className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
      />

      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{singer}</p>
        <p className="mt-1 text-sm font-medium text-violet-600">
          {Number(price).toLocaleString()}원
        </p>
        <button
          type="button"
          onClick={() => dispatch(removeItem(id))}
          className="mt-1 text-xs text-gray-400 hover:text-red-500"
        >
          삭제
        </button>
      </div>

      {/* 수량 조절: - (감소) / 수량 / + (증가) 가로 배치 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(decrease(id))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-300 text-violet-500 hover:bg-violet-50 hover:text-violet-700"
          aria-label="수량 감소"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center font-semibold">{amount}</span>
        <button
          type="button"
          onClick={() => dispatch(increase(id))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-300 text-violet-500 hover:bg-violet-50 hover:text-violet-700"
          aria-label="수량 증가"
        >
          <Plus size={16} />
        </button>
      </div>
    </li>
  );
};

export default CartItemCard;
