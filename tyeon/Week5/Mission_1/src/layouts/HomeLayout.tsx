import { Outlet, useNavigate } from "react-router-dom";

export default function HomeLayout() {
    const navigate = useNavigate();

    return (
        <div className="h-dvh flex flex-col">
            <nav className="flex relative p-8 h-12 w-full items-center bg-blue-300">
                <h1 onClick={() => navigate("/")} className="absolute left-8 text-2xl font-bold">돌려돌려LP판</h1>
                <div className="absolute right-8 flex gap-2">
                    <button onClick={() => navigate("/login")} className="rounded-md p-1 bg-blue-500 text-white">로그인</button>
                    <button onClick={() => navigate("/signup")} className="rounded-md p-1 bg-white text-black">회원가입</button>
                </div>
            </nav>
            <main className="flex flex-col h-full justify-center items-center">
                <Outlet />
            </main>
        </div>
    )
}