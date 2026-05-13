import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { accessToken } = useAuth();
    const [nickname, setNickname] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!accessToken) {
            setNickname("");
            return;
        }

        const fetchMyInfo = async () => {
            try {
                const response = await getMyInfo();
                setNickname(response.data.name);
            } catch (error) {
                console.error("내 정보 조회 오류:", error);
                setNickname("");
            }
        };

        fetchMyInfo();
    }, [accessToken]);

    return (
        <>
        <nav className='bg-white dark:bg-gray-800 shadow-md fixed w-full z-10'>
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    <button
                        type='button'
                        aria-label='사이드바 열기'
                        onClick={() => setIsSidebarOpen(true)}
                        className='flex h-10 w-10 items-center justify-center text-gray-900 dark:text-white'
                    >
                        <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                        </svg>
                    </button>
                    <Link
                        to='/'
                        className='text-xl font-bold text-gray-900 dark:text-white'>
                            돌려돌려 돌림판
                    </Link>
                </div>
                {accessToken ? (
                    <div className='space-x-6'>
                        {nickname && (
                            <span className='text-gray-700 dark:text-gray-300'>
                                {nickname}님 반갑습니다.
                            </span>
                        )}
                        <Link 
                            to='/my' 
                            className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>
                                마이페이지
                        </Link>
                        <Link
                            to='/search'
                            className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>
                                검색
                        </Link>
                    </div>
                ) : (
                    <div className='space-x-6'>
                        <Link 
                            to='/login'
                            className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>
                                로그인
                        </Link>
                        <Link 
                            to='/signup'
                            className='text-gray-700 dark:text-gray-300 hover:text-blue-500'>
                                회원가입
                        </Link>
                    </div>
                )}
            </div>
        </nav>
        {isSidebarOpen && (
            <div
                className='fixed inset-0 z-20 bg-black/40'
                onClick={() => setIsSidebarOpen(false)}
            >
                <aside
                    className='h-full w-64 bg-white p-6 shadow-lg dark:bg-gray-800 sm:w-72'
                    onClick={(event) => event.stopPropagation()}
                >
                    <nav className='flex flex-col gap-4'>
                        <Link
                            to='/my'
                            onClick={() => setIsSidebarOpen(false)}
                            className='text-gray-900 hover:text-blue-500 dark:text-white'
                        >
                            마이페이지
                        </Link>
                        <span className='text-gray-900 dark:text-white'>검색</span>
                    </nav>
                </aside>
            </div>
        )}
        </>
    );
};

export default Navbar; 
