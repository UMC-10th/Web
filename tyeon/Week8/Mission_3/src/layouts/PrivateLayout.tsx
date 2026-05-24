import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import useSidebar from "../hooks/useSidebar";

const PrivateLayout = () => {
    const navigate = useNavigate();
    const { accessToken, logout } = useAuth();
    const { isOpen: sidebarOpen, close: closeSidebar, toggle: toggleSidebar } = useSidebar();

    const { data } = useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfo,
        enabled: !!accessToken,
        staleTime: 1000 * 60,
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => navigate("/"),
    });

    if (!accessToken) {
        return <Navigate to={"/login"} replace />;
    }

    return (
        <div className="h-dvh flex flex-col">
            <nav className="flex relative p-8 h-12 w-full items-center bg-blue-300 shrink-0 z-40">
                {/* 버거 버튼 */}
                <button
                    onClick={toggleSidebar}
                    className="absolute left-4 text-black hover:text-black/70 transition-colors"
                    aria-label="메뉴"
                >
                    <svg width="26" height="26" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill="none" stroke="currentColor" strokeLinecap="round"
                            strokeLinejoin="round" strokeWidth="4"
                            d="M7.95 11.95h32m-32 12h32m-32 12h32"
                        />
                    </svg>
                </button>

                <h1 onClick={() => navigate("/")} className="absolute left-14 text-2xl font-bold cursor-pointer">돌려돌려LP판</h1>

                <div className="absolute right-8 flex gap-2">
                    <button onClick={() => navigate("/my")} className="rounded-md p-1 pl-3 pr-3 bg-white text-black">
                        {`${data?.data?.name ?? ""}님 반갑습니다.`}
                    </button>
                    <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="rounded-md p-1 pl-3 pr-3 bg-blue-500 text-white disabled:bg-gray-400"
                    >
                        {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                    </button>
                </div>
            </nav>

            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <main className="flex flex-col h-full justify-center items-center">
                <Outlet />
            </main>
        </div>
    )
}

export default PrivateLayout;