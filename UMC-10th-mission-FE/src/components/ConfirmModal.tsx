import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ConfirmModalProps {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  message,
  confirmLabel = "예",
  cancelLabel = "아니오",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onCancel(); }}
      className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center"
    >
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <p className="text-white text-base font-medium leading-relaxed pr-4">
            {message}
          </p>
          <button
            onClick={onCancel}
            aria-label="닫기"
            className="text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-[#2a2a2a] text-gray-300 font-bold hover:bg-[#333] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "처리 중..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
