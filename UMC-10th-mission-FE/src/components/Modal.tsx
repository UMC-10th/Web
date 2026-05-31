import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

export default function Modal() {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => dispatch(closeModal())}
      />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center gap-6">
        <p className="text-lg font-semibold text-gray-800 text-center">
          모든 항목을 삭제하시겠습니까?
        </p>
        <div className="flex gap-4 w-full">
          <button
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
          >
            네
          </button>
          <button
            onClick={() => dispatch(closeModal())}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}
