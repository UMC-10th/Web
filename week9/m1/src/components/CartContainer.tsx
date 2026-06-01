import CartItemCard from './CartItemCard';
import { openModal } from '../store/modalSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { amount, cartItems, total } = useAppSelector((state) => state.cart);

  if (amount < 1) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">장바구니</h2>
        <p className="mt-4 text-slate-500">장바구니가 비어 있습니다.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">장바구니</h2>
      <ul className="bg-white px-5 shadow-sm">
        {cartItems.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </ul>

      <footer className="mt-8 border-t-2 border-slate-200 pt-6">
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-slate-600">
            총 수량 <b className="text-slate-900">{amount}</b>개
          </span>
          <span className="font-medium text-slate-600">
            총 금액 <b className="text-[#0BAEB3]">{total.toLocaleString()}원</b>
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(openModal())}
          className="mt-6 w-full rounded-md border border-red-400 py-3 font-semibold text-red-500 hover:bg-red-500 hover:text-white"
        >
          장바구니 전체 삭제
        </button>
      </footer>
    </section>
  );
};

export default CartContainer;
