import { Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import type { CartItem } from '../types/cart';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
  const { decrease, increase, removeItem } = useCartStore();

  return (
    <li className="flex items-center gap-4 border-b border-slate-200 py-4">
      <img src={item.img} alt={item.title} className="h-20 w-20 rounded-md object-cover" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">{item.title}</p>
        <p className="text-sm text-slate-500">{item.singer}</p>
        <p className="mt-1 text-sm font-semibold text-[#0BAEB3]">
          {item.price.toLocaleString()}원
        </p>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="mt-1 text-xs text-slate-400 hover:text-red-500"
        >
          삭제
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => decrease(item.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0ECFD3] text-[#0BAEB3]"
          aria-label="수량 감소"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center font-semibold">{item.amount}</span>
        <button
          type="button"
          onClick={() => increase(item.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0ECFD3] text-[#0BAEB3]"
          aria-label="수량 증가"
        >
          <Plus size={16} />
        </button>
      </div>
    </li>
  );
};

export default CartItemCard;
