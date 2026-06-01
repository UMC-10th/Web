interface HamburgerProps {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HamburgerButton = ({
  onClick,
  isOpen,
  onClose,
}: HamburgerProps) => {
  return (
    <button
      onClick={isOpen ? onClose : onClick}
      className="relative z-50 p-2 rounded-lg hover:bg-gray-600 transition-colors"
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <span
          className={`block w-full h-0.5 bg-gray-600 rounded transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1" : ""}`}
        />
        <span
          className={`block w-full h-0.5 bg-gray-600 rounded transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-full h-0.5 bg-gray-600 rounded transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1" : ""}`}
        />
      </div>
    </button>
  );
};
