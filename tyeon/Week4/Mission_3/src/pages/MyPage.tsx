import { useEffect } from "react"
import { getMyInfo } from "../apis/auth";

export default function MyPage() {
    useEffect(() => {
        const myData = async () => {
            const response = await getMyInfo();
            console.log(response);
        }

        myData();
    }, []); // 첫 마운트 시점에만 실행되도록
    return <></>
}