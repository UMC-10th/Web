import { useCartStore } from '../store/useCartStore';

const Modal = () => {
  const { clearCart, closeModal } = useCartStore();

  const handleConfirm = () => {
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-md bg-white p-6 text-center shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">장바구니를 비울까요?</h2>
        <p className="mt-3 text-sm text-slate-500">
          담긴 플레이리스트가 모두 삭제됩니다.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 rounded-md border border-slate-300 py-2 font-semibold text-slate-600 hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-md bg-red-500 py-2 font-semibold text-white hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
