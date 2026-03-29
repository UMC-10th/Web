import { useTheme, THEME } from "../context/ThemeProvider";
import clsx from "clsx";

function ThemeContent() {
    const {theme} = useTheme();
    const isLight = theme === THEME.LIGHT;

    return (
    <div className={clsx(
        'p-4 h-dvh transition-all flex justify-center',
        isLight ? 'bg-gray-100 text-black' : 'bg-gray-800 text-white'
    )}>
        <h1>{isLight ? '라이트 모드' : '다크 모드'}</h1>
    </div>
    );
}

export default ThemeContent;