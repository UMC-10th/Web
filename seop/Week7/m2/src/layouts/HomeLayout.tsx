import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { signout } from '../apis/auth';
import LpCreateModal from '../components/LpCreateModal';

export default function HomeLayout() {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      localStorage.clear();
      refetchUser();
      navigate('/login');
    },
  });

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1a1a2e] border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
            </svg>
          </button>
          <Link to="/" className="text-pink-500 font-bold text-xl">돌려돌려LP판</Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-300 text-sm">{user.name}님 반갑습니다.</span>
              <button onClick={() => logout()} className="text-gray-300 hover:text-white text-sm">로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white text-sm">로그인</button>
              <button onClick={() => navigate('/signup')} className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 text-sm">회원가입</button>
            </>
          )}
        </div>
      </header>

      {/* 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-48 bg-[#1a1a2e] border-r border-gray-700 transform transition-transform duration-300 pt-16 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <nav className="flex flex-col gap-2 px-4 py-6">
          <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white py-2" onClick={() => setIsSidebarOpen(false)}>
            🔍 찾기
          </Link>
          <Link to="/my" className="flex items-center gap-2 text-gray-300 hover:text-white py-2" onClick={() => setIsSidebarOpen(false)}>
            👤 마이페이지
          </Link>
        </nav>
        {user && (
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="absolute bottom-6 left-4 text-gray-500 hover:text-white text-sm"
          >
            탈퇴하기
          </button>
        )}
      </aside>

      {/* 메인 */}
      <main className="pt-16 md:pl-48 min-h-screen">
        <Outlet />
      </main>

      {/* 플로팅 버튼 */}
      {user && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:bg-pink-600 z-50"
        >
          +
        </button>
      )}

      {/* LP 작성 모달 */}
      {isModalOpen && <LpCreateModal onClose={() => setIsModalOpen(false)} />}

      {/* 탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#2a2a3e] rounded-xl p-8 flex flex-col items-center gap-6">
            <p className="text-white text-lg">정말 탈퇴하시겠습니까?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200"
              >
                예
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}