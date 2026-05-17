import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGetMyInfo } from "../hooks/useGetMyInfo";
import EditProfileModal from "../components/EditProfileModal";

const MyPage = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { data: response, isPending } = useGetMyInfo(accessToken);
  const userInfo = response?.data ?? null;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0f1014] p-8">
      <h1 className="text-[#FF1493] text-3xl font-bold mb-8">마이페이지</h1>

      {userInfo ? (
        <div className="max-w-md border border-[#FF1493] rounded-xl p-6 bg-[#111] flex flex-col gap-4">
          {/* 아바타 + 이름/이메일 + 설정 버튼 */}
          <div className="flex items-center gap-4">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FF1493] shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border-2 border-[#333] flex items-center justify-center text-gray-500 text-2xl font-bold shrink-0">
                {userInfo.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-white text-xl font-bold truncate">
                {userInfo.name}
              </p>
              <p className="text-gray-400 text-sm truncate">{userInfo.email}</p>
            </div>

            {/* 설정 버튼 */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              aria-label="프로필 설정"
              className="text-gray-400 hover:text-[#FF1493] transition-colors p-1 shrink-0"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Bio */}
          {userInfo.bio ? (
            <p className="text-gray-300 text-sm border-t border-[#333] pt-4">
              {userInfo.bio}
            </p>
          ) : (
            <p className="text-gray-600 text-sm border-t border-[#333] pt-4 italic">
              아직 자기소개가 없습니다.
            </p>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 w-full h-[48px] rounded-lg bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-4">
            사용자 정보를 불러올 수 없습니다.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#FF1493] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            다시 로그인하기
          </button>
        </div>
      )}

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && userInfo && (
        <EditProfileModal
          userInfo={userInfo}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyPage;
