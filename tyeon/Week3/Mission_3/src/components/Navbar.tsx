import { NavLink } from "react-router";

const LINKS = [
    { to: '/', label: '홈' },
    { to: '/movies/popular', label: '인기 영화' },
    { to: '/movies/now_playing', label: '상영 중' },
    { to: '/movies/top_rated', label: '고평점' },
    { to: '/movies/upcoming', label: '개봉 예정' },
]

export const Navbar = () => {
    return (
        <div className="flex gap-3 p-4">
            {LINKS.map(({to, label}) => (
                <NavLink
                    // NavLink를 이용해 현재 페이지의 경우 다른 style 적용되게끔 구현
                    key={to}
                    to={to}
                    className={({isActive}) => {
                        return isActive ? 'text-[#00ad4b] font-bold' : 'text-gray-500'
                    }}>
                    {label}
                </NavLink>
            ))}
        </div>
    );
}