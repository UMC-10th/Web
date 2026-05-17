// src/pages/LPDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGetLpDetail } from "../hooks/useGetLPDetail";
import { deleteLp, postLpLike } from "../apis/lp";
import type { LpDetailResponse } from "../types/lp";
import CommentSection from "../components/CommentSection";
import LpWriteModal from "../components/LpWriteModal";
import ConfirmModal from "../components/ConfirmModal";

const LPDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다! 🚨");
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
    // location은 navigate 시 현재 pathname을 state에 담기 위한 값이므로
    // 의존성 배열에서 제외해 쿼리 상태 변화로 인한 불필요한 effect 재실행을 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const { data: response, isPending, isError, refetch } = useGetLpDetail(lpid);

  // LP 삭제
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLp(Number(lpid)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/lps");
    },
  });

  // 좋아요 토글 (낙관적 업데이트)
  const { mutate: handleLike, isPending: isLiking } = useMutation({
    mutationFn: () => postLpLike(Number(lpid)),
    onMutate: async () => {
      // 진행 중인 상세 조회 쿼리 취소 (race condition 방지)
      await queryClient.cancelQueries({ queryKey: ["lp", lpid] });

      // 롤백용 스냅샷 저장
      const previousData = queryClient.getQueryData<LpDetailResponse>(["lp", lpid]);

      // 좋아요 상태 즉시 토글
      queryClient.setQueryData<LpDetailResponse>(["lp", lpid], (old) => {
        if (!old) return old;
        const liked = old.data.isLiked ?? false;
        return {
          ...old,
          data: {
            ...old.data,
            isLiked: !liked,
            likes: (old.data.likes ?? 0) + (liked ? -1 : 1),
          },
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      // 요청 실패 시 스냅샷으로 롤백 (에러 시 재요청 없이 롤백만 수행)
      if (context?.previousData) {
        queryClient.setQueryData(["lp", lpid], context.previousData);
      }
    },
    onSuccess: () => {
      // 성공 시에만 서버 최신 데이터로 동기화
      // (실패 시 재요청을 막아 LP 상세 오류 화면으로 튕기는 현상 방지)
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });

  if (!accessToken) return null;

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014] gap-4">
        <p className="text-red-500 font-bold">데이터를 불러오는데 실패했습니다 😭</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#FF1493] text-white rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8 animate-pulse">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div className="w-full aspect-video bg-[#222] rounded-xl"></div>
          <div className="h-10 bg-[#222] w-2/3 rounded"></div>
          <div className="h-6 bg-[#222] w-1/3 rounded"></div>
          <div className="h-40 bg-[#222] w-full rounded mt-4"></div>
        </div>
      </div>
    );
  }

  const lp = response?.data;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* LP 썸네일 */}
        {lp?.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full aspect-video object-cover rounded-xl border border-[#333]"
          />
        ) : (
          <div className="w-full aspect-video bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#333]">
            <span className="text-gray-500">이미지가 없습니다</span>
          </div>
        )}

        {/* LP 메타 정보 */}
        <div>
          <h1 className="text-[#FF1493] text-4xl font-bold">
            {lp?.title || "제목 없음"}
          </h1>
          <div className="flex gap-4 mt-2 text-gray-400 text-sm">
            <span>
              📅{" "}
              {lp?.createdAt
                ? new Date(lp.createdAt).toLocaleDateString()
                : "업로드일 모름"}
            </span>
            <span>❤️ 좋아요 {lp?.likes ?? 0}개</span>
            {lp?.artist && <span>🎤 아티스트: {lp.artist}</span>}
          </div>
          {lp?.tags && lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {lp.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-[#2a2a2a] text-[#FF1493] text-xs px-3 py-1 rounded-full border border-[#FF1493]/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <hr className="border-[#333]" />

        <div className="text-white text-lg leading-relaxed min-h-[150px]">
          {lp?.content || "본문 내용이 없습니다."}
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3 mt-8">
          {/* 좋아요 */}
          <button
            type="button"
            onClick={() => handleLike()}
            disabled={isLiking}
            className="flex items-center gap-2 px-6 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            <Heart
              size={16}
              className={lp?.isLiked ? "fill-[#FF1493] text-[#FF1493]" : "text-white"}
            />
            좋아요 {lp?.likes ?? 0}
          </button>

          {/* 수정 */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-2 border border-[#FF1493] text-[#FF1493] hover:bg-[#FF1493] hover:text-white rounded-lg font-bold transition-colors"
          >
            수정
          </button>

          {/* 삭제 */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          >
            삭제
          </button>
        </div>

        {/* 댓글 영역 */}
        <hr className="border-[#333] my-8" />
        <CommentSection lpId={lpid!} />

      </div>

      {/* LP 수정 모달 — LpWriteModal을 edit 모드로 재사용 */}
      {isEditModalOpen && lp && (
        <LpWriteModal
          mode="edit"
          lpId={lp.id}
          initialData={{
            title: lp.title,
            content: lp.content ?? "",
            thumbnail: lp.thumbnail,
            tags: lp.tags ?? [],
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <ConfirmModal
          message="이 LP를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
          confirmLabel="삭제"
          cancelLabel="취소"
          isPending={isDeleting}
          onConfirm={() => handleDelete()}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LPDetailPage;
