import { useTheme, THEME } from "../context/ThemeProvider";
import ThemeToggleBtn from "./ThemeToggleBtn";
import clsx from "clsx";

function NavBar() {
    const {theme, toggleTheme} = useTheme();
    const isLight = theme === THEME.LIGHT;
        
    console.log({theme, toggleTheme});
    return (
        <div className={clsx(
            'p-4 w-full flex justify-center items-center transition-all',
            isLight ? 'bg-gray-100 text-black' : 'bg-gray-800 text-white'
        )}>
            <ThemeToggleBtn />
        </div>
    );
}

export default NavBar;