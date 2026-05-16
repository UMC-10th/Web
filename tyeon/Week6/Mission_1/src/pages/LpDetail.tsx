import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Tag { id: number; name: string; }
interface Likes { id: number; userId: number; }
interface Lp {
  id: number; title: string; content: string; thumbnail: string;
  published: boolean; authorId: number; createdAt: Date; updatedAt: Date;
  tags: Tag[]; likes: Likes[];
}

const fetchLpDetail = async (lpId: string): Promise<Lp> => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}`);
  const lp = data?.data ?? data;
  if (!lp) throw new Error("LP 데이터가 없습니다.");
  return lp;
};

const deleteLp = async (lpId: string) => {
  await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}`);
};

const toggleLike = async (lpId: string) => {
  const { data } = await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpId}/likes`);
  return data;
};

const DetailSkeleton = () => (
  <div className="animate-pulse w-full px-10 py-10 space-y-6">
    <div className="h-6 w-24 rounded-lg" style={{ background: "#dbeafe" }} />
    <div className="w-full rounded-2xl" style={{ aspectRatio: "16/9", background: "#dbeafe" }} />
    <div className="h-8 w-3/4 rounded-lg" style={{ background: "#dbeafe" }} />
    <div className="h-4 w-40 rounded" style={{ background: "#e0e9f8" }} />
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 rounded" style={{ background: "#e0e9f8", width: `${85 - i * 8}%` }} />
      ))}
    </div>
  </div>
);

const DetailError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center w-full h-full gap-4">
    <span className="text-4xl opacity-40">💿</span>
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

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUserId = 1;

  const { data: lp, isLoading, isError, refetch } = useQuery<Lp>({
    queryKey: ["lp", lpId],
    queryFn: () => fetchLpDetail(lpId!),
    enabled: !!lpId,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lpId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate(-1);
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(lpId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) deleteMutation.mutate();
  };

  const isOwner = lp?.authorId === currentUserId;
  const isLiked = lp?.likes.some((l) => l.userId === currentUserId) ?? false;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden" style={{ background: "#f4f7fb" }}>

      {/* 뒤로가기 + 수정/삭제 툴바 */}
      <div
        className="shrink-0 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: "1px solid #e0e9f8", background: "rgba(244,247,251,0.95)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: "#3b82f6" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#1d4ed8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#3b82f6")}
        >
          ← 목록으로
        </button>

        {isOwner && lp && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/lp/${lpId}/edit`)}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all"
              style={{ color: "#3b82f6", borderColor: "#bfdbfe", background: "white" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#eff6ff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "white")}
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: deleteMutation.isPending ? "#94a3b8" : "#ef4444" }}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}
      </div>

      {/* 메인 */}
      <main className="flex-1 overflow-y-auto w-full">
        {isLoading && <DetailSkeleton />}
        {isError && <DetailError onRetry={refetch} />}

        {!isLoading && !isError && lp && (
          <article className="w-full px-10 py-10">

            {/* 상단: 썸네일 + 사이드 정보 2단 레이아웃 */}
            <div className="flex gap-10 mb-10">

              {/* 썸네일 */}
              <div
                className="shrink-0 rounded-2xl overflow-hidden"
                style={{
                  width: "45%",
                  aspectRatio: "1/1",
                  boxShadow: "0 8px 32px rgba(29,78,216,0.14)",
                }}
              >
                {lp.thumbnail ? (
                  <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "conic-gradient(from 0deg,#1e3a8a,#3b82f6,#bfdbfe,#1e3a8a)" }}
                  >
                    <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                      <div className="w-8 h-8 rounded-full" style={{ background: "rgba(255,255,255,0.7)" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* 우측 정보 */}
              <div className="flex flex-col justify-between flex-1 py-2">
                <div>
                  {/* 미발행 배지 */}
                  {!lp.published && (
                    <span
                      className="inline-block mb-3 text-xs px-3 py-1 rounded-full font-semibold"
                      style={{ background: "#fef9c3", color: "#92400e" }}
                    >
                      미발행
                    </span>
                  )}

                  {/* 제목 */}
                  <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: "#1e3a8a" }}>
                    {lp.title}
                  </h1>

                  {/* 업로드일 */}
                  <p className="text-sm mb-5" style={{ color: "#94a3b8" }}>
                    {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>

                  {/* 태그 */}
                  {lp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {lp.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 좋아요 버튼 */}
                <button
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-150 self-start mt-6"
                  style={{
                    background: isLiked ? "#fee2e2" : "white",
                    color: isLiked ? "#ef4444" : "#94a3b8",
                    border: `1.5px solid ${isLiked ? "#fca5a5" : "#e0e9f8"}`,
                    boxShadow: isLiked ? "0 2px 10px rgba(239,68,68,0.15)" : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLiked) (e.currentTarget as HTMLElement).style.borderColor = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    if (!isLiked) (e.currentTarget as HTMLElement).style.borderColor = "#e0e9f8";
                  }}
                >
                  <span className="text-base">{isLiked ? "❤️" : "🤍"}</span>
                  <span>{lp.likes.length}개</span>
                </button>
              </div>
            </div>

            {/* 구분선 */}
            <div className="mb-8" style={{ borderTop: "1px solid #dbeafe" }} />

            {/* 본문 */}
            <div className="text-base leading-8 whitespace-pre-wrap" style={{ color: "#334155" }}>
              {lp.content}
            </div>

          </article>
        )}
      </main>
    </div>
  );
}