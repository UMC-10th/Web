import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useGetLpListInfinite } from "../hooks/useGetLPListInfinite";
import { useSearchLpListInfinite } from "../hooks/useSearchLpListInfinite";
import { useDebounce } from "../hooks/useDebounce";
import { useThrottle } from "../hooks/useThrottle";
import { createLp } from "../apis/lp";
import type { Lp } from "../types/lp";

const SkeletonCard = () => (
  <div className="w-full aspect-square bg-[#222] animate-pulse rounded" />
);

const CreateLpModal = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = () => {
    if (!title.trim()) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    tags.forEach((tag) => formData.append("tags", tag));
    if (thumbnail) formData.append("thumbnail", thumbnail);
    mutate(formData);
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
    >
      <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">LP 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#222] text-white px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF1493] placeholder-gray-500"
        />

        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="bg-[#222] text-white px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF1493] placeholder-gray-500 resize-none"
        />

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm">LP 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-gray-300 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#FF1493] file:text-white"
          />
          {preview && (
            <img src={preview} alt="preview" className="w-24 h-24 rounded-full object-cover border-2 border-[#333] mx-auto" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="태그 입력"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              className="flex-1 bg-[#222] text-white px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF1493] placeholder-gray-500 text-sm"
            />
            <button onClick={addTag} className="px-4 py-2 bg-[#333] text-white rounded-lg text-sm hover:bg-[#444]">
              추가
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#444] text-gray-300 text-sm">
                  # {tag}
                  <button onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title.trim() || isPending}
          className="w-full py-3 bg-[#FF1493] text-white font-bold rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {isPending ? "업로드 중..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

const LPListPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 실제 input 값 (타이핑 즉시 반영)
  const bottomRef = useRef<HTMLDivElement>(null);

  // [week8/mission1] useDebounce 적용 - 300ms 동안 입력이 없을 때만 debouncedQuery 업데이트
  // → searchQuery는 타이핑마다 바뀌지만 API 호출은 debouncedQuery 기준으로만 발생
  const debouncedQuery = useDebounce(searchQuery, 300);

  // debouncedQuery가 있을 때만 검색 모드로 전환
  const isSearchMode = debouncedQuery.trim().length > 0;

  // 기존 훅 - 검색어 없을 때 전체 목록 (week6에서 쓰던 것 그대로)
  const {
    data: listData,
    isPending: isListPending,
    isError: isListError,
    refetch: refetchList,
    fetchNextPage: fetchNextList,
    hasNextPage: hasNextList,
    isFetchingNextPage: isFetchingNextList,
  } = useGetLpListInfinite(sort);

  // [week8/mission1] 새로 추가 - debouncedQuery를 queryKey로 사용해 검색 결과 무한스크롤
  const {
    data: searchData,
    isPending: isSearchPending,
    isError: isSearchError,
    fetchNextPage: fetchNextSearch,
    hasNextPage: hasNextSearch,
    isFetchingNextPage: isFetchingNextSearch,
  } = useSearchLpListInfinite(debouncedQuery, sort);

  const lpList: Lp[] = isSearchMode
    ? searchData?.pages.flatMap((page) => page.data.data) ?? []
    : listData?.pages.flatMap((page) => page.data.data) ?? [];

  const isPending = isSearchMode ? isSearchPending : isListPending;
  const isError = isSearchMode ? isSearchError : isListError;
  const hasNextPage = isSearchMode ? hasNextSearch : hasNextList;
  const isFetchingNextPage = isSearchMode ? isFetchingNextSearch : isFetchingNextList;
  const fetchNextPage = isSearchMode ? fetchNextSearch : fetchNextList;

  // [week8/mission2] 다음 페이지 호출을 1초에 최대 1번으로 제한
  // 스크롤을 빠르게 내려도 1초 간격으로만 fetchNextPage 실행됨
  const throttledFetchNextPage = useThrottle(
    useCallback(() => {
      console.log("[Throttle] fetchNextPage 실행");
      fetchNextPage();
    }, [fetchNextPage]),
    1000
  );

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          // throttle 적용 - 연속 스크롤 시 과도한 API 호출 방지
          throttledFetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, throttledFetchNextPage]);

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
        <p className="text-red-500">데이터를 불러오는데 실패했습니다 😭</p>
        <button
          onClick={() => refetchList()}
          className="px-4 py-2 bg-[#FF1493] text-white rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      {isModalOpen && <CreateLpModal onClose={() => setIsModalOpen(false)} />}

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-[#FF1493] text-3xl font-bold">나의 LP 보관함</h1>
          <button
            onClick={() => setSort((prev) => (prev === "latest" ? "oldest" : "latest"))}
            className="text-white bg-[#333] px-4 py-2 rounded-lg hover:bg-[#555]"
          >
            {sort === "latest" ? "⬇️ 최신순" : "⬆️ 오래된순"}
          </button>
        </div>

        {/* [week8/mission1] 검색창 - searchQuery(즉시) vs debouncedQuery(지연) 분리 */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="LP 검색..."
          className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-[#333] outline-none focus:border-[#FF1493] placeholder-gray-500 transition-colors"
        />
        {searchQuery !== debouncedQuery && (
          <p className="text-gray-500 text-xs">입력 중...</p>
        )}
        {isSearchMode && (
          <p className="text-gray-400 text-sm">
            <span className="text-[#FF1493] font-bold">"{debouncedQuery}"</span> 검색 결과
          </p>
        )}
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : lpList.length === 0 ? (
        <p className="text-gray-400">
          {isSearchMode ? "검색 결과가 없습니다." : "보관된 LP가 없습니다."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {lpList.map((lp) => (
              <div
                key={lp.id}
                onClick={() => navigate(`/lp/${lp.id}`)}
                className="group relative w-full aspect-square overflow-hidden cursor-pointer"
              >
                {lp.thumbnail ? (
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-sm line-clamp-2">{lp.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-300 text-xs">
                      {lp.createdAt ? new Date(lp.createdAt).toLocaleDateString() : ""}
                    </p>
                    <p className="text-gray-300 text-xs">❤️ {lp.likes?.length ?? 0}</p>
                  </div>
                </div>
              </div>
            ))}

            {isFetchingNextPage &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
          </div>

          <div ref={bottomRef} className="h-4" />
        </>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF1493] rounded-full flex justify-center items-center text-white text-3xl shadow-lg hover:scale-110 transition-transform z-40"
      >
        +
      </button>
    </div>
  );
};

export default LPListPage;
