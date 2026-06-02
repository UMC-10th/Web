import { clearCart } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function Modal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  if (!isOpen) return null;

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-cart-title"
        className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl"
      >
        <h2 id="clear-cart-title" className="text-2xl font-extrabold text-slate-950">
          정말 삭제하시겠습니까?
        </h2>
        <p className="mt-3 text-sm font-medium text-slate-500">
          장바구니의 모든 음반이 삭제됩니다.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="rounded-md bg-slate-200 px-6 py-3 text-lg font-bold text-slate-800 transition-colors hover:bg-slate-300"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-rose-500 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-rose-600"
          >
            네
          </button>
        </div>
      </section>
    </div>
  );
}
