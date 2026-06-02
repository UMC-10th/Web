interface HamburgerButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export default function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
    return (
        <button
            onClick={onClick}
            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-lg text-black hover:bg-white/20 transition-colors"
            aria-label="메뉴"
            aria-expanded={isOpen}
        >
            <span className="flex h-5 w-6 flex-col justify-between">
                <span
                    className={`h-0.5 w-full rounded bg-current transition-transform ${
                        isOpen ? "translate-y-[9px] rotate-45" : ""
                    }`}
                />
                <span
                    className={`h-0.5 w-full rounded bg-current transition-opacity ${
                        isOpen ? "opacity-0" : ""
                    }`}
                />
                <span
                    className={`h-0.5 w-full rounded bg-current transition-transform ${
                        isOpen ? "-translate-y-[9px] -rotate-45" : ""
                    }`}
                />
            </span>
        </button>
    );
}
