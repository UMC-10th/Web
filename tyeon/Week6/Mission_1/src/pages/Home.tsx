import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Tag { id: number; name: string; }
interface Likes { id: number; userId: number; }
interface Lp {
  id: number; title: string; content: string; thumbnail: string;
  published: boolean; authorId: number; createdAt: Date; updatedAt: Date;
  tags: Tag[]; likes: Likes[];
}

type SortOrder = "newest" | "oldest";
type ActiveNav = "search" | "mypage";

const useMockAuth = () => ({ isLoggedIn: true, nickname: "홍길동" });

const fetchLps = async (sort: SortOrder): Promise<Lp[]> => {
  const order = sort === "newest" ? "desc" : "asc";
  const { data } = await axios.get(
    `${import.meta.env.VITE_SERVER_API_URL}/v1/lps?order=${order}`
  );
  const result = data?.data?.data ?? data?.data ?? data ?? [];
  if (!Array.isArray(result)) throw new Error("올바르지 않은 응답 형식입니다.");
  return result;
};

const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="rounded-2xl animate-pulse" style={{ aspectRatio: "1/1", background: "#dbeafe" }} />
    ))}
  </div>
);

const GridError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center flex-1 gap-4 py-24">
    <span className="text-5xl opacity-30">💿</span>
    <p className="text-sm" style={{ color: "#64748b" }}>데이터를 불러오지 못했습니다.</p>
    <button
      onClick={onRetry}
      className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
      style={{ background: "#1d4ed8" }}
    >
      다시 시도
    </button>
  </div>
);

const LpCard = ({ lp, onClick }: { lp: Lp; onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        aspectRatio: "1/1",
        border: "1px solid",
        borderColor: hovered ? "#93c5fd" : "#e0e9f8",
        boxShadow: hovered ? "0 12px 32px rgba(29,78,216,0.18)" : "0 2px 8px rgba(29,78,216,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.22s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* 썸네일 */}
      {lp.thumbnail ? (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "conic-gradient(from 0deg,#1e3a8a,#3b82f6,#bfdbfe,#1e3a8a)" }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="w-5 h-5 rounded-full" style={{ background: "rgba(255,255,255,0.7)" }} />
          </div>
        </div>
      )}

      {/* 호버 오버레이 */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{
          background: hovered ? "rgba(15,23,60,0.74)" : "rgba(15,23,60,0)",
          backdropFilter: hovered ? "blur(5px)" : "blur(0px)",
          transition: "background 0.25s ease, backdrop-filter 0.25s ease",
        }}
      >
        {!lp.published && hovered && (
          <span
            className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "#fef9c3", color: "#92400e" }}
          >
            미발행
          </span>
        )}
        {hovered && (
          <span
            className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          >
            ❤️ {lp.likes.length}
          </span>
        )}

        <div
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          <h2 className="font-bold text-white text-sm leading-snug mb-1 truncate">{lp.title}</h2>
          <p
            className="text-xs leading-relaxed mb-2"
            style={{
              color: "rgba(255,255,255,0.65)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {lp.content}
          </p>
          {lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {lp.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(147,197,253,0.2)", color: "#bfdbfe", border: "1px solid rgba(147,197,253,0.3)" }}
                >
                  #{tag.name}
                </span>
              ))}
              {lp.tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
                  +{lp.tags.length - 3}
                </span>
              )}
            </div>
          )}
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
            {new Date(lp.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useMockAuth();

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<ActiveNav>("search");

  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: lpList = [], isLoading, isError, refetch } = useQuery<Lp[]>({
    queryKey: ["lps", sortOrder],
    queryFn: () => fetchLps(sortOrder),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  const filtered = lpList.filter(
    (lp) =>
      lp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lp.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lp.tags.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCardClick = (lp: Lp) => {
    if (!isLoggedIn) {
      if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
        navigate("/login");
      }
      return;
    }
    navigate(`/lp/${lp.id}`);
  };

  const NAV_ITEMS: { key: ActiveNav; icon: string; label: string; path: string }[] = [
    { key: "search", icon: "🔍", label: "찾기", path: "/" },
    { key: "mypage", icon: "👤", label: "마이페이지", path: "/mypage" },
  ];

  return (
    <div
      className="flex w-full h-full overflow-hidden"
      style={{ background: "#f4f7fb" }}
    >
      {/* 딤 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── 사이드바 ──────────────────────────────────── */}
      <aside
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full z-30 flex flex-col"
        style={{
          width: 220,
          background: "#1a2e6e",
          boxShadow: "4px 0 20px rgba(26,46,110,0.18)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav className="flex flex-col gap-1 px-2 py-6">
          {NAV_ITEMS.map(({ key, icon, label, path }) => {
            const isActive = activeNav === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveNav(key);
                  navigate(path);
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{
                  background: isActive ? "rgba(255,255,255,0.95)" : "transparent",
                  color: isActive ? "#1a2e6e" : "rgba(255,255,255,0.65)",
                  fontWeight: isActive ? 700 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#3b82f6" }} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── 메인 콘텐츠 ───────────────────────────────── */}
      <main className="flex flex-col w-full h-full overflow-hidden">

        {/* 서브헤더: 검색 + 정렬 */}
        <div
          className="shrink-0 flex items-center justify-between px-6 py-3 gap-4"
          style={{ background: "rgba(244,247,251,0.95)", borderBottom: "1px solid #e0e9f8" }}
        >
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#93c5fd" }}>🔍</span>
            <input
              type="text"
              placeholder="제목, 내용, 태그 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors"
              style={{
                background: "white",
                borderColor: searchQuery ? "#3b82f6" : "#dbeafe",
                color: "#1e3a8a",
              }}
            />
          </div>

          <div className="flex items-center rounded-xl overflow-hidden border shrink-0" style={{ borderColor: "#dbeafe" }}>
            {(["newest", "oldest"] as SortOrder[]).map((order) => (
              <button
                key={order}
                onClick={() => setSortOrder(order)}
                className="px-4 py-2 text-xs font-semibold transition-all duration-150"
                style={{
                  background: sortOrder === order ? "#1d4ed8" : "white",
                  color: sortOrder === order ? "white" : "#64748b",
                }}
              >
                {order === "newest" ? "최신순" : "오래된순"}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 수 */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            {isLoading ? "불러오는 중..." : `${filtered.length}개의 LP`}
          </span>
        </div>

        {/* 그리드 */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isLoading && <GridSkeleton />}
          {isError && <GridError onRetry={refetch} />}
          {!isLoading && !isError && (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                <span className="text-5xl">💿</span>
                <p className="text-sm" style={{ color: "#64748b" }}>검색 결과가 없습니다</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((lp) => (
                  <LpCard key={lp.id} lp={lp} onClick={() => handleCardClick(lp)} />
                ))}
              </div>
            )
          )}
        </div>
      </main>

      {/* ── 플로팅 + 버튼 ─────────────────────────────── */}
      <button
        onClick={() => navigate("/lp/create")}
        className="fixed bottom-8 right-8 z-30 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-light text-white"
        style={{
          background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
          boxShadow: "0 6px 24px rgba(29,78,216,0.4)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(29,78,216,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(29,78,216,0.4)";
        }}
        aria-label="LP 추가"
      >
        +
      </button>
    </div>
  );
}