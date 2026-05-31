import { useCartStore } from '../store/useCartStore';

export default function Modal() {
  const isModalOpen = useCartStore((state) => state.isModalOpen);
  const clearCart = useCartStore((state) => state.clearCart);
  const closeModal = useCartStore((state) => state.closeModal);

  if (!isModalOpen) return null;

  return (
    /* 배경 오버레이 */
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      onClick={closeModal}
    >
      {/* 모달 카드 — 클릭 이벤트 버블링 차단 */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <span className="text-4xl">🗑️</span>
          <h2 className="text-lg font-bold text-gray-800 mt-3">전체 삭제</h2>
          <p className="text-sm text-gray-500 mt-1">
            플레이리스트의 모든 음반을 삭제할까요?
            <br />이 작업은 되돌릴 수 없어요.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={clearCart}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            네, 삭제할게요
          </button>
        </div>
      </div>
    </div>
  );
}
