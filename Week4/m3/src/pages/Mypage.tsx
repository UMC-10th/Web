import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

const Mypage = () => {
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    const [error, setError] = useState("");

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

    if (error) {
        return <div>{error}</div>;
    }

    if (!data) {
        return <div>내 정보를 불러오는 중...</div>;
    }

    return (
        <div>
            {data.data.name} {data.data.email}
        </div>
    );
};

export default Mypage;
