import { useState, useEffect, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { patchMyProfile } from "../apis/auth";
import type { ResMyInfoDto } from "../types/auth";

interface EditProfileModalProps {
  userInfo: ResMyInfoDto["data"];
  onClose: () => void;
}

const EditProfileModal = ({ userInfo, onClose }: EditProfileModalProps) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState(userInfo.name);
  const [bio, setBio] = useState(userInfo.bio ?? "");
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userInfo.avatar ?? null
  );

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview && avatarPreview !== userInfo.avatar)
      URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: patchMyProfile,
    onMutate: async (variables) => {
      // 진행 중인 내 정보 쿼리 취소 (race condition 방지)
      await queryClient.cancelQueries({ queryKey: ["user", "me"] });

      // 롤백용 스냅샷 저장
      const previousData = queryClient.getQueryData<ResMyInfoDto>(["user", "me"]);

      // 서버 응답 전에 UI 즉시 반영
      queryClient.setQueryData<ResMyInfoDto>(["user", "me"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            name: variables.name,
            bio: variables.bio || null,
          },
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      // 요청 실패 시 스냅샷으로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(["user", "me"], context.previousData);
      }
    },
    onSuccess: () => {
      onClose();
    },
    onSettled: () => {
      // 성공·실패 무관하게 서버 최신 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) return;
    updateProfile({
      name: name.trim(),
      bio,            // 빈 문자열도 그대로 전송 → bio 초기화 허용
      avatar: avatarFile, // 선택 안 했으면 undefined → 서버에서 기존 유지
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">프로필 수정</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <label className="cursor-pointer group relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="프로필 사진"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#FF1493]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#111] border-2 border-[#333] flex items-center justify-center text-gray-500 text-3xl font-bold">
                {name.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            {/* 호버 오버레이 */}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold">변경</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <span className="text-gray-500 text-xs">
            클릭해서 사진 변경 (선택 사항)
          </span>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="profile-name"
            className="text-gray-400 text-sm font-semibold"
          >
            이름 <span className="text-[#FF1493]">*</span>
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="bg-[#111] text-white border border-[#333] rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF1493] transition-colors"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="profile-bio"
            className="text-gray-400 text-sm font-semibold"
          >
            Bio{" "}
            <span className="text-gray-600 font-normal">(선택 사항)</span>
          </label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력하세요"
            rows={3}
            className="bg-[#111] text-white border border-[#333] rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF1493] transition-colors resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#2a2a2a] text-gray-300 font-bold hover:bg-[#333] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
