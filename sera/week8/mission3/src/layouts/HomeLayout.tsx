import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useGetMyInfo } from "../hooks/useGetMyInfo";
import { useSidebar } from "../hooks/useSidebar";

export default function HomeLayout() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { isOpen, open, close } = useSidebar();

  const { data: userInfo } = useGetMyInfo(accessToken);

  const { mutate: mutateLogout } = useMutation({
    mutationFn: async () => { await logout(); },
    onSuccess: () => navigate("/"),
  });

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0f1014] text-white relative">
      {/* 헤더 */}
      <nav className="flex justify-between items-center px-4 md:px-8 h-16 w-full bg-[#1a1a1a] border-b border-[#333] z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-white" onClick={open}>
            <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
            </svg>
          </button>
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-[#FF1493] cursor-pointer select-none"
          >
            돌려돌려LP판
          </h1>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          {accessToken ? (
            <>
              <span className="text-gray-300 mr-2">
                <span className="text-[#FF1493] font-bold">
                  {userInfo?.data?.name || "회원"}
                </span>님 반갑습니다.
              </span>
              <button onClick={() => navigate("/lps")} className="hover:text-[#FF1493]">LP목록</button>
              <button onClick={() => navigate("/mypage")} className="hover:text-[#FF1493]">마이페이지</button>
              <button
                onClick={() => mutateLogout()}
                className="rounded-md px-4 py-2 bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-md px-4 py-2 bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity"
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-md px-4 py-2 bg-[#333] text-white font-bold hover:bg-[#444] transition-colors"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-1 w-full">
        {/* 오버레이 - 사이드바 열릴 때 배경 클릭으로 닫기 */}
        <div
          className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={close}
        />

        {/* 사이드바 */}
        <aside
          className={`fixed md:static top-0 left-0 h-full w-64 bg-[#1a1a1a] border-r border-[#333] z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-gray-400 font-bold mb-4">메뉴</h2>
            <ul className="flex flex-col gap-2 flex-1">
              <li
                onClick={() => { navigate("/lps"); close(); }}
                className="cursor-pointer hover:text-[#FF1493]"
              >
                LP 보관함
              </li>
              {accessToken && (
                <li
                  onClick={() => { navigate("/mypage"); close(); }}
                  className="cursor-pointer hover:text-[#FF1493]"
                >
                  마이페이지
                </li>
              )}
            </ul>
          </div>
        </aside>

        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
