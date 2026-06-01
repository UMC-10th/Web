import { useEffect } from 'react';
import CartItem from './CartItem';
import { calculateTotals, clearCart } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`;

export default function CartContainer() {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <section className="rounded-lg bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-950">장바구니가 비어 있습니다</h2>
          <p className="mt-3 text-slate-500">전체 수량 {amount}개, 총 금액 {formatPrice(total)}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <section className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-6 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Shopping Cart</p>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-950">내 플레이리스트</h2>
        </div>
        <div className="px-5 sm:px-8">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <footer className="px-5 py-6 sm:px-8">
          <div className="flex items-center justify-between border-t border-slate-300 pt-5">
            <div>
              <p className="text-sm font-medium text-slate-500">총 수량</p>
              <p className="text-2xl font-extrabold text-slate-950">{amount}개</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">총 금액</p>
              <p className="text-2xl font-extrabold text-slate-950">{formatPrice(total)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="mx-auto mt-8 block rounded-md border border-slate-900 px-8 py-3 text-lg font-bold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
          >
            전체 삭제
          </button>
        </footer>
      </section>
    </main>
  );
}
