import emptyProfileImg from "../img/emptyProfile.png";
import type { Person } from "../types/credits";

interface IProfile {
    key: number;
    person: Person;
}

export default function Profile ({key, person}: IProfile) {
    // 사진 url이 존재한다면(즉 프로필 사진이 존재한다면) 해당 이미지 경로 이용
    // 그렇지 않다면 대체 이미지 경로 이용
    const imgUrl = person.profile_path ? import.meta.env.VITE_TMDB_IMG_BASE_URL+person.profile_path : emptyProfileImg

    // character: 배우일 경우 작품 내 맡은 역할을 뜻함.
    // known_for_department: 파트 구분 (배우, 작가, 감독 등...)
    return (
    <>
        <div className="flex flex-col justify-center items-center">
            <img className="w-32 h-32 rounded-full border" src={imgUrl}/>
            <p className="font-bold pt-1 text-center">{person.name}</p>
            <p className="text-gray-400">{person.character} ({person.known_for_department})</p>
        </div>
    </>
    );
}