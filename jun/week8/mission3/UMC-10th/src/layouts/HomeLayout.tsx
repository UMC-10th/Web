import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetMyInfo } from "../hooks/useGetMyInfo";
import { useState } from "react";
import LPWriteModal from "../components/LPWriteModal";
import useSidebar from "../hooks/useSidebar";

export default function HomeLayout() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, close, toggle } = useSidebar();

  const { data: userInfo } = useGetMyInfo(accessToken);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-[#0f1014] text-white">
      {/* 네비게이션 */}
      <nav className="flex justify-between items-center px-4 md:px-8 h-16 w-full bg-[#1a1a1a] border-b border-[#333] z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-white" onClick={toggle}>
            <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
            </svg>
          </button>
          <h1 onClick={() => navigate("/")} className="text-2xl font-bold text-[#FF1493] cursor-pointer select-none">돌려돌려LP판</h1>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          {accessToken ? (
            <>
              <span className="text-gray-300 mr-2">
                <span className="text-[#FF1493] font-bold">{userInfo?.data?.name || "회원"}</span>님 반갑습니다.
              </span>
              <button onClick={() => navigate("/lps")} className="hover:text-[#FF1493]">LP목록</button>
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

      <div className="flex">
        {/* 모바일 오버레이 */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={close}
          />
        )}

        {/* 사이드바 */}
        <aside
          className={`
            fixed md:sticky md:top-16 top-0 left-0 h-screen w-64
            bg-[#1a1a1a] border-r border-[#333] z-50
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 flex-shrink-0
          `}
        >
          <div className="p-4 pt-20 md:pt-4">
            <h2 className="text-gray-400 font-bold mb-4">메뉴</h2>
            <ul className="flex flex-col gap-2">
              <li
                onClick={() => { navigate("/lps"); close(); }}
                className="cursor-pointer hover:text-[#FF1493] transition-colors"
              >
                LP 보관함
              </li>
              {accessToken && (
                <li
                  onClick={() => { navigate("/mypage"); close(); }}
                  className="cursor-pointer hover:text-[#FF1493] transition-colors"
                >
                  마이페이지
                </li>
              )}
            </ul>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* FAB 버튼 */}
      {accessToken && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF1493] rounded-full flex justify-center items-center text-white text-3xl shadow-lg hover:scale-110 transition-transform z-50"
        >
          +
        </button>
      )}

      {isModalOpen && <LPWriteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}