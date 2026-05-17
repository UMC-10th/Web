import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdraw } from '../api/lps';
import Navbar from '../components/Navbar';
import useLocalStorage from '../hooks/useLocalStorage';

const RootLayout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [, , removeAccessToken] = useLocalStorage('accessToken', '');
  const [, , removeNickname] = useLocalStorage('nickname', '준영');
  const withdrawMutation = useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      removeAccessToken();
      removeNickname();
      queryClient.clear();
      setIsWithdrawOpen(false);
      navigate('/login', { replace: true });
    },
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[180px_1fr]">
        <aside className="hidden min-h-[calc(100vh-65px)] border-r border-gray-800 bg-[#111] p-5 text-sm text-gray-300 md:block">
          <nav className="flex flex-col gap-3">
            <span className="font-semibold text-white">메뉴</span>
            <NavLink to="/" className="hover:text-white">
              찾기
            </NavLink>
            <NavLink to="/mypage" className="hover:text-white">
              마이페이지
            </NavLink>
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(true)}
              className="mt-3 text-left text-red-300 hover:text-red-100"
            >
              탈퇴하기
            </button>
          </nav>
        </aside>
        <main className="min-h-[calc(100vh-65px)] px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-md border border-gray-700 bg-[#151515] p-5">
            <h2 className="text-lg font-bold">정말 탈퇴하시겠어요?</h2>
            <p className="mt-2 text-sm text-gray-400">동의하면 계정 정보가 삭제되고 로그인 화면으로 이동합니다.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsWithdrawOpen(false)}
                className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300"
              >
                아니오
              </button>
              <button
                type="button"
                disabled={withdrawMutation.isPending}
                onClick={() => withdrawMutation.mutate()}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-700"
              >
                {withdrawMutation.isPending ? '처리 중...' : '예'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RootLayout;
