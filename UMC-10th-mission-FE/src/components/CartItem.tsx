import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { increase, decrease, removeItem, calculateTotals } from '../store/cartSlice';
import type { CartItem as CartItemType } from '../types/cart';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const handleIncrease = () => {
    dispatch(increase(item.id));
    dispatch(calculateTotals());
  };

  const handleDecrease = () => {
    dispatch(decrease(item.id));
    dispatch(calculateTotals());
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
    dispatch(calculateTotals());
  };

  return (
    <article className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4">
      <img
        src={item.img}
        alt={item.title}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{item.title}</p>
        <p className="text-sm text-gray-500 truncate">{item.singer}</p>
        <p className="text-sm font-medium text-indigo-600 mt-1">
          {Number(item.price).toLocaleString()}원
        </p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleIncrease}
          className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition"
        >
          +
        </button>
        <span className="font-semibold text-gray-700">{item.amount}</span>
        <button
          onClick={handleDecrease}
          className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition"
        >
          -
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="ml-2 text-gray-400 hover:text-red-500 transition text-lg"
        aria-label="remove"
      >
        ✕
      </button>
    </article>
  );
}
