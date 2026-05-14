import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  getMyInfo,
  postLogout,
  patchMyInfo,
  deleteMyAccount,
} from "../apis/auth";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: myInfoRes,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const userInfo = myInfoRes?.data;

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      logout();
      navigate("/", { replace: true });
    },
    onError: () => {
      logout();
      navigate("/", { replace: true });
    },
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: patchMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setIsEditing(false);
      setAvatarPreview(null);
    },
    onError: () => alert("프로필 수정에 실패했습니다. 다시 시도해주세요."),
  });

  const { mutate: handleDeleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      logout();
      navigate("/login", { replace: true });
    },
    onError: () => alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요."),
  });

  const handleStartEdit = () => {
    setNameInput(userInfo?.name ?? "");
    setBioInput(userInfo?.bio ?? "");
    setAvatarPreview(null);
    setIsEditing(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmitProfile = () => {
    if (!nameInput.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    updateProfile({
      name: nameInput.trim(),
      bio: bioInput.trim(),
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014]">
        <div className="text-gray-400 text-lg animate-pulse">
          사용자 정보 확인 중...
        </div>
      </div>
    );
  }

  if (isError || !userInfo) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-400 mb-4">사용자 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-[#FF1493] text-white rounded-lg font-bold hover:opacity-90"
        >
          다시 로그인하기
        </button>
      </div>
    );
  }

  const displayAvatar = avatarPreview ?? userInfo.avatar;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <h1 className="text-[#FF1493] text-3xl font-bold mb-8">마이페이지</h1>

      <div className="max-w-md border border-[#FF1493] rounded-xl p-6 bg-[#111] flex flex-col gap-5">

        <div className="flex items-center gap-4">
          <div
            className={`relative ${isEditing ? "cursor-pointer" : ""}`}
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FF1493]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#333] flex items-center justify-center text-gray-500 text-2xl font-bold">
                {userInfo.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📷</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          <div className="flex-1">
            {isEditing ? (
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="닉네임"
                className="w-full bg-[#1a1a1a] border border-[#444] text-white rounded-lg px-3 py-1.5 outline-none focus:border-[#FF1493] mb-1"
              />
            ) : (
              <p className="text-white text-xl font-bold">{userInfo.name}</p>
            )}
            <p className="text-gray-400 text-sm">{userInfo.email}</p>
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
            placeholder="자기소개 (선택)"
            rows={3}
            className="w-full bg-[#1a1a1a] border border-[#444] text-white rounded-lg px-3 py-2 outline-none focus:border-[#FF1493] resize-none"
          />
        ) : (
          userInfo.bio && (
            <p className="text-gray-300 text-sm border-t border-[#333] pt-4">
              {userInfo.bio}
            </p>
          )
        )}

        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={handleSubmitProfile}
              disabled={isUpdating}
              className="flex-1 h-11 rounded-lg bg-[#FF1493] text-white font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isUpdating ? "저장 중..." : "저장"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isUpdating}
              className="flex-1 h-11 rounded-lg bg-[#333] text-white font-bold hover:bg-[#444] transition-colors"
            >
              취소
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleStartEdit}
              className="w-full h-11 rounded-lg border border-[#FF1493] text-[#FF1493] font-bold hover:bg-[#FF1493] hover:text-white transition-colors"
            >
              ✏️ 프로필 수정
            </button>
            <button
              onClick={() => handleLogout()}
              disabled={isLoggingOut}
              className="w-full h-11 rounded-lg bg-[#FF1493] text-white font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full h-11 rounded-lg border border-red-600 text-red-500 font-bold hover:bg-red-600 hover:text-white transition-colors"
            >
              탈퇴하기
            </button>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8 flex flex-col items-center gap-6 w-80">
            <p className="text-white text-lg font-bold text-center">
              정말 탈퇴하시겠습니까?
            </p>
            <p className="text-gray-400 text-sm text-center">
              탈퇴 시 모든 데이터가 삭제되며
              <br />복구할 수 없습니다.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => handleDeleteAccount()}
                disabled={isDeleting}
                className="flex-1 h-11 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "처리 중..." : "예"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 h-11 rounded-lg bg-[#333] text-white font-bold hover:bg-[#444] transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;