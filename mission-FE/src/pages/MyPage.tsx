import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import type { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);
      setData(response);
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <span className="text-5xl text-gray-600">🙂</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <input
                className="bg-black border border-white/30 rounded-md px-3 py-2 text-xl w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={data?.data?.name ?? ""}
                placeholder="이름"
              />
              <button className="w-8 h-8 rounded-full bg-transparent border border-white/30 flex items-center justify-center">
                ✓
              </button>
            </div>

            <input
              className="mt-3 bg-black border border-white/20 rounded-md px-3 py-2 w-72 focus:outline-none"
              defaultValue={data?.data?.name ?? "프론트 짱"}
            />

            <div className="mt-3 text-sm text-white/80">
              {data?.data?.email}
            </div>
          </div>
        </div>

        <hr className="my-8 border-t border-white/10" />

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <button className="text-white/90 border-b-2 border-transparent pb-2">
                내가 좋아요 한 LP
              </button>
              <button className="text-white/50">내가 작성한 LP</button>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-md bg-white/10 text-white">
                오래된순
              </button>
              <button className="px-3 py-1 rounded-md bg-white text-black">
                최신순
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <img
              src="https://via.placeholder.com/240"
              alt="lp"
              className="w-full h-auto rounded-md"
            />
            <img
              src="https://via.placeholder.com/240"
              alt="lp"
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/create")}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-pink-500 text-white text-2xl flex items-center justify-center shadow-lg"
          aria-label="새 LP 추가"
        >
          +
        </button>

        <div className="mt-24 flex justify-center">
          <button
            type="button"
            className="px-6 py-2 rounded-md bg-gray-800/60 text-white/80 border border-white/20"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
