// src/layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetMyInfo } from "../hooks/useGetMyInfo";
import { useSidebar } from "../hooks/useSidebar";

export default function HomeLayout() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { isOpen, open, close } = useSidebar();

  const { data: userInfo } = useGetMyInfo(accessToken);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0f1014] text-white relative">

      {/* --- 상단 네비게이션 헤더 --- */}
      <nav className="flex justify-between items-center px-4 md:px-8 h-16 w-full bg-[#1a1a1a] border-b border-[#333] z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-white" onClick={open} aria-label="메뉴 열기">
            <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
            </svg>
          </button>

          <h1 onClick={() => navigate("/")} className="text-2xl font-bold text-[#FF1493] cursor-pointer select-none">
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
              <button onClick={() => navigate("/search")} className="hover:text-[#FF1493]">검색</button>
              <button onClick={() => navigate("/mypage")} className="hover:text-[#FF1493]">마이페이지</button>
              <button onClick={handleLogout} className="rounded-md px-4 py-2 bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity">로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="rounded-md px-4 py-2 bg-[#FF1493] text-white font-bold hover:opacity-90 transition-opacity">로그인</button>
              <button onClick={() => navigate("/signup")} className="rounded-md px-4 py-2 bg-[#333] text-white font-bold hover:bg-[#444] transition-colors">회원가입</button>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-1 w-full">
        {/* [요구사항 1] 딤 오버레이 — opacity transition으로 부드럽게 등장/소멸 */}
        <div
          onClick={close}
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* [요구사항 1] 사이드바 — translateX transition으로 슬라이드 인/아웃 */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] border-r border-[#333] z-50
            transition-transform duration-300 ease-in-out
            md:static md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-400 font-bold">메뉴</h2>
              <button onClick={close} className="md:hidden text-gray-400 hover:text-white" aria-label="메뉴 닫기">✕</button>
            </div>
            <ul className="flex flex-col gap-2">
              <li onClick={() => handleNavigate("/lps")} className="cursor-pointer hover:text-[#FF1493] py-1">
                LP 보관함
              </li>
              <li onClick={() => handleNavigate("/search")} className="cursor-pointer hover:text-[#FF1493] py-1">
                LP 검색
              </li>
              {accessToken && (
                <li onClick={() => handleNavigate("/mypage")} className="cursor-pointer hover:text-[#FF1493] py-1">
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

      {/* --- 우측 하단 플로팅 버튼 (+) --- */}
      <button
        onClick={() => navigate("/write")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF1493] rounded-full flex justify-center items-center text-white text-3xl shadow-lg hover:scale-110 transition-transform z-50"
      >
        +
      </button>
    </div>
  );
}
