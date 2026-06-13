import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

export default function Modal() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.modal);

  if (!isOpen) return null;

  const handleNo = () => {
    dispatch(closeModal());
  };

  const handleYes = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <>
      {/* 오버레이 배경 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* 모달 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">장바구니를 비우시겠어요?</h2>
            <p className="text-gray-500 text-sm">이 작업은 되돌릴 수 없습니다.</p>
          </div>

          {/* 확인 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3">
            <button
              onClick={handleNo}
              className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            >
              아니요
            </button>
            <button
              onClick={handleYes}
              className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 active:bg-red-700 transition-colors cursor-pointer"
            >
              네
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
