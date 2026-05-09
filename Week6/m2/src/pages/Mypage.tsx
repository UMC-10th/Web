 import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Mypage = () => {

    const navigate = useNavigate();
    const {logout} = useAuth();

    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                setData(response);
            } catch (error) {
                const message = error instanceof Error ? error.message : "내 정보를 불러오지 못했습니다.";
                setError(message);
            }
        };

        getData();
    }, []);

    const handleLogout = async() => {
        await logout();
        navigate('/home');
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!data) {
        return <div>내 정보를 불러오는 중입니다.</div>;
    }

    const user = data.data;

    return (
        <div>
            <h1>{user.name}님 환영합니다</h1>
            {user.avatar && <img src={user.avatar} alt={`${user.name} 프로필`} />}
            <h1>{user.email}</h1>

            <button className="cursor-pointer bg-blue-300 rounded-sm  p-3 hover:scale-90" onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default Mypage;
