import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

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
  const { deleteAccount } = useAuth();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const activeKey: ActiveNav =
    location.pathname.startsWith("/my") ? "mypage" : "search";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  const withdrawMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      onClose();
      navigate("/login");
    },
  });

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
        className="fixed top-12 left-0 z-30 flex flex-col justify-between"
        style={{
          width: 220,
          height: "calc(100dvh - 3rem)",
          background: "#1a2e6e",
          boxShadow: "4px 0 20px rgba(26,46,110,0.18)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* 내비게이션 메뉴 */}
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

        {/* 하단 탈퇴하기 버튼 */}
        <div className="px-2 py-5">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
            style={{ color: "rgba(248,113,113,0.8)", background: "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.12)";
              (e.currentTarget as HTMLElement).style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.8)";
            }}
          >
            <span className="text-base">🚪</span>
            <span>탈퇴하기</span>
          </button>
        </div>
      </aside>

      {/* 탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-2xl p-7 w-80 flex flex-col gap-5"
            style={{ background: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
          >
            <div className="text-center">
              <span className="text-3xl">⚠️</span>
              <h2 className="text-base font-bold mt-3" style={{ color: "#1e3a8a" }}>정말 탈퇴하시겠습니까?</h2>
              <p className="text-xs mt-2" style={{ color: "#94a3b8" }}>
                탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
              </p>
            </div>
            {withdrawMutation.isError && (
              <p className="text-xs text-center" style={{ color: "#ef4444" }}>
                탈퇴 처리 중 오류가 발생했습니다.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ color: "#64748b", borderColor: "#e0e9f8", background: "white" }}
              >
                아니오
              </button>
              <button
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: withdrawMutation.isPending ? "#94a3b8" : "#ef4444" }}
              >
                {withdrawMutation.isPending ? "탈퇴 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
