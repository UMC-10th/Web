import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { closeModal } from '../store/modalSlice';
import { clearCart } from '../store/cartSlice';

const Modal = () => {
  const dispatch = useAppDispatch();
  // 모달 열림 여부는 전역 상태(modalSlice)에서만 읽어옴 (useState 미사용)
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  // 닫혀 있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // "네" → 장바구니 전체 삭제(clearCart) + 모달 닫기(closeModal)
  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    // 화면 전체를 덮는 어두운 반투명 오버레이
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-2xl bg-white p-8 text-center shadow-xl">
        <p className="text-lg font-semibold text-gray-900">
          정말 모두 삭제하시겠어요?
        </p>

        <div className="mt-6 flex justify-center gap-3">
          {/* "아니요" → 모달만 닫기 */}
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="flex-1 rounded-lg border border-gray-300 py-2 font-medium text-gray-600 hover:bg-gray-100"
          >
            아니요
          </button>
          {/* "네" → 전체 삭제 후 닫기 */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-red-500 py-2 font-medium text-white hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
