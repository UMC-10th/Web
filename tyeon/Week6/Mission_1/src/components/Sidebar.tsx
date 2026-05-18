import { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type ActiveNav = "search" | "mypage";

const NAV_ITEMS: { key: ActiveNav; icon: string; label: string; path: string }[] = [
  { key: "search", icon: "🔍", label: "찾기", path: "/" },
  { key: "mypage", icon: "👤", label: "마이페이지", path: "/my" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 현재 경로 기반으로 활성 메뉴 자동 감지
  const activeKey: ActiveNav =
    location.pathname.startsWith("/my") ? "mypage" : "search";

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* 딤 오버레이 */}
      <div
        className="fixed inset-0 z-20 bg-black/30 transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* 사이드바 */}
      <aside
        ref={sidebarRef}
        className="fixed top-12 left-0 z-30 flex flex-col"
        style={{
          width: 220,
          height: "calc(100dvh - 3rem)",
          background: "#1a2e6e",
          boxShadow: "4px 0 20px rgba(26,46,110,0.18)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav className="flex flex-col gap-1 px-2 py-5">
          {NAV_ITEMS.map(({ key, icon, label, path }) => {
            const isActive = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  navigate(path);
                  onClose();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{
                  background: isActive ? "rgba(255,255,255,0.95)" : "transparent",
                  color: isActive ? "#1a2e6e" : "rgba(255,255,255,0.65)",
                  fontWeight: isActive ? 700 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#3b82f6" }} />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}