import { THEME, useTheme } from '../context/ThemeProvider';
import clsx from 'clsx';

function ThemeToggleBtn() {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === THEME.LIGHT;

    return (
        <button onClick={toggleTheme}
            className={clsx('px-4 py-2 mt-4 rounded-md transition-all', 
                isLight ? 'bg-gray-300 text-black' : 'bg-gray-600 text-white')}
            >
            {isLight ? '🌙 Dark' : '☀️ Light'}
        </button>
    );
}

export default ThemeToggleBtn;