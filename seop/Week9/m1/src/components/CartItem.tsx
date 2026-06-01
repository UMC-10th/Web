import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../types/cart';
import { decrease, increase, removeItem } from '../store/cartSlice';
import { useAppDispatch } from '../store/hooks';

interface CartItemProps {
  item: CartItemType;
}

const formatPrice = (price: string) => `${Number(price).toLocaleString('ko-KR')}원`;

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();

  return (
    <article className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b border-slate-200 py-5 sm:grid-cols-[96px_1fr_auto]">
      <img
        src={item.img}
        alt={`${item.title} 앨범 커버`}
        className="h-20 w-20 rounded-md object-cover sm:h-24 sm:w-24"
      />
      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-slate-950 sm:text-xl">{item.title}</h2>
        <p className="truncate text-sm font-medium text-slate-500">{item.singer}</p>
        <p className="mt-1 text-base font-extrabold text-slate-800">
          {formatPrice(item.price)}
        </p>
        <button
          type="button"
          onClick={() => dispatch(removeItem(item.id))}
          className="mt-3 inline-flex items-center gap-1 rounded-md text-sm font-semibold text-rose-500 transition-colors hover:text-rose-700"
        >
          <Trash2 size={15} aria-hidden="true" />
          삭제
        </button>
      </div>
      <div className="flex items-center overflow-hidden rounded-md border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => dispatch(decrease(item.id))}
          aria-label={`${item.title} 수량 감소`}
          className="flex h-9 w-9 items-center justify-center bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300"
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="flex h-9 w-11 items-center justify-center text-lg font-semibold text-slate-950">
          {item.amount}
        </span>
        <button
          type="button"
          onClick={() => dispatch(increase(item.id))}
          aria-label={`${item.title} 수량 증가`}
          className="flex h-9 w-9 items-center justify-center bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
