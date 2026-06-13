import { useCartStore } from '../store/useCartStore';

export default function CartTotals() {
  const amount = useCartStore((state) => state.amount);
  const total = useCartStore((state) => state.total);
  const openModal = useCartStore((state) => state.openModal);

  return (
    <footer className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>총 수량</span>
          <span className="font-semibold text-gray-800">{amount}개</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="text-base font-bold text-gray-800">총 금액</span>
          <span className="text-lg font-bold text-indigo-600">
            {total.toLocaleString('ko-KR')}원
          </span>
        </div>

        {/* 전체 삭제는 바로 실행하지 않고 모달을 열어 확인받음 */}
        <button
          onClick={openModal}
          className="mt-2 w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          전체 삭제
        </button>
      </div>
    </footer>
  );
}
