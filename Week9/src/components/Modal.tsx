import { useModalInfo, useModalActions } from "../hooks/useModal";
import { useCartActions } from "../hooks/useCartStore";

const Modal = () => {
  const { isOpen } = useModalInfo();
  const { closeModal } = useModalActions();
  const { clearCart } = useCartActions();

  if (!isOpen) return null;

  const handleClickNo = () => closeModal();

  const handleClickYes = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[min(92vw,420px)] rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900">
          정말 삭제하시겠습니까?
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          확인하시면 장바구니의 모든 상품이 삭제됩니다.
        </p>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={handleClickNo}
          >
            아니요
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 cursor-pointer"
            onClick={handleClickYes}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
