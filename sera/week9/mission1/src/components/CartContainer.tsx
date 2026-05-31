import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearCart } from '../store/cartSlice';
import CartItemCard from './CartItemCard';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  // 장바구니가 비었을 때
  if (amount < 1) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">장바구니</h2>
        <p className="mt-4 text-gray-500">장바구니가 비어 있어요 🥲</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
        장바구니
      </h2>

      <ul>
        {cartItems.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </ul>

      {/* 총 수량 / 총 금액 + 전체 삭제 */}
      <footer className="mt-8 border-t-2 border-gray-300 pt-6">
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-gray-600">
            총 수량 <span className="font-bold text-gray-900">{amount}</span>개
          </span>
          <span className="font-medium text-gray-600">
            총 금액{' '}
            <span className="font-bold text-violet-600">
              {total.toLocaleString()}원
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => dispatch(clearCart())}
          className="mt-6 w-full rounded-lg border border-red-400 py-3 font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
        >
          장바구니 전체 삭제
        </button>
      </footer>
    </section>
  );
};

export default CartContainer;
