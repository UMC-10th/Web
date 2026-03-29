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
        <h1>{isLight ? '라이트 모드입니다.\n세상이 참 밝네요...' : '다크 모드입니다.\n세상이 참 어둡네요...'}</h1>
    </div>
    );
}

export default ThemeContent;