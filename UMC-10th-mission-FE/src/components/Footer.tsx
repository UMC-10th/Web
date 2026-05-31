import useCartStore from '../store/useCartStore';
import useModalStore from '../store/useModalStore';

export default function Footer() {
  const { amount, total } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  return (
    <footer className="bg-gray-900 text-white px-6 py-5">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">총 수량</p>
          <p className="text-lg font-bold">{amount}개</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-sm text-gray-400">총 금액</p>
          <p className="text-lg font-bold">{total.toLocaleString()}원</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto mt-4">
        <button
          onClick={openModal}
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
        >
          전체 삭제
        </button>
      </div>
    </footer>
  );
}
