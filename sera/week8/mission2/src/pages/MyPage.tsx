import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useGetMyInfo } from "../hooks/useGetMyInfo";
import { updateMyInfo, deleteAccount } from "../apis/auth";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, logout } = useAuth();
  const { data, isPending } = useGetMyInfo(accessToken);
  const userInfo = data?.data;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const openEdit = () => {
    setEditName(userInfo?.name ?? "");
    setEditBio(userInfo?.bio ?? "");
    setEditAvatar(null);
    setAvatarPreview(null);
    setIsEditOpen(true);
  };

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setIsEditOpen(false);
    },
  });

  const { mutate: mutateWithdraw } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await logout();
      navigate("/login", { replace: true });
    },
  });

  const { mutate: mutateLogout } = useMutation({
    mutationFn: async () => { await logout(); },
    onSuccess: () => navigate("/", { replace: true }),
  });

  const handleSubmitEdit = () => {
    const formData = new FormData();
    if (editName.trim()) formData.append("name", editName);
    formData.append("bio", editBio);
    if (editAvatar) formData.append("avatar", editAvatar);
    mutateUpdate(formData);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-[#0f1014]">
        <div className="text-gray-400 text-lg animate-pulse">사용자 정보 확인 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <h1 className="text-[#FF1493] text-3xl font-bold mb-8">마이페이지</h1>

      {/* 프로필 수정 모달 */}
      {isEditOpen && (
        <div
          ref={overlayRef}
          onClick={(e) => { if (e.target === overlayRef.current) setIsEditOpen(false); }}
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
        >
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-xl font-bold">프로필 수정</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="flex flex-col items-center gap-2">
              {avatarPreview ? (
                <img src={avatarPreview} alt="preview" className="w-20 h-20 rounded-full object-cover border-2 border-[#FF1493]" />
              ) : userInfo?.avatar ? (
                <img src={userInfo.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-[#333]" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#333] flex items-center justify-center text-white text-2xl font-bold">
                  {userInfo?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setEditAvatar(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
                className="text-gray-300 text-sm file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#333] file:text-white"
              />
            </div>

            <input
              type="text"
              placeholder="이름"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-[#222] text-white px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF1493] placeholder-gray-500"
            />

            <textarea
              placeholder="bio (선택)"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={2}
              className="bg-[#222] text-white px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF1493] placeholder-gray-500 resize-none"
            />

            <button
              onClick={handleSubmitEdit}
              disabled={isUpdating}
              className="w-full py-3 bg-[#FF1493] text-white font-bold rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {isUpdating ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold">정말 탈퇴하시겠어요?</h2>
            <p className="text-gray-400 text-sm">탈퇴 후에는 데이터를 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="flex-1 py-3 bg-[#333] text-white font-bold rounded-lg hover:bg-[#444]"
              >
                아니오
              </button>
              <button
                onClick={() => mutateWithdraw()}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

      {userInfo ? (
        <div className="max-w-md border border-[#FF1493] rounded-xl p-6 bg-[#111] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-[#FF1493]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#333] flex items-center justify-center text-gray-500 text-2xl font-bold">
                {userInfo.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-white text-xl font-bold">{userInfo.name}</p>
              <p className="text-gray-400 text-sm">{userInfo.email}</p>
            </div>
          </div>

          {userInfo.bio && (
            <p className="text-gray-300 text-sm border-t border-[#333] pt-4">{userInfo.bio}</p>
          )}

          <button
            onClick={openEdit}
            className="w-full h-[48px] rounded-lg bg-[#333] text-white font-bold hover:bg-[#444] transition-colors"
          >
            설정 (프로필 수정)
          </button>

          <button
            onClick={() => mutateLogout()}
            className="w-full h-[48px] rounded-lg bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity"
          >
            로그아웃
          </button>

          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full h-[48px] rounded-lg bg-transparent text-red-400 font-bold border border-red-400 hover:bg-red-400/10 transition-colors"
          >
            탈퇴하기
          </button>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-4">사용자 정보를 불러올 수 없습니다.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#FF1493] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            다시 로그인하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPage;
