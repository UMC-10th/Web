import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetMyInfo } from "../hooks/useGetMyInfo";

const MyPage = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { data, isPending } = useGetMyInfo(accessToken);
  const userInfo = data?.data;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
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

      {userInfo ? (
        <div className="max-w-md border border-[#FF1493] rounded-xl p-6 bg-[#111] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FF1493]"
              />
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
            onClick={handleLogout}
            className="mt-4 w-full h-[48px] rounded-lg bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity"
          >
            로그아웃
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
