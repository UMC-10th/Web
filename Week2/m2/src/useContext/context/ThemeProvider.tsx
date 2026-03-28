import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

export const THEME = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
} as const;

type TTheme = (typeof THEME)[keyof typeof THEME];

interface IThemeContextState {
    theme: TTheme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContextState | undefined>(undefined);

export const ThemeProvider = ({children}: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme) => prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
    };

    // 전체 화면(스크롤·여백 포함) 배경을 테마와 맞춤 — 레이아웃은 ContextPage의 Shell이 담당
    useEffect(() => {
        const light = theme === THEME.LIGHT;
        const bg = light ? "#ffffff" : "#111827";
        const fg = light ? "#171717" : "#fafafa";
        document.documentElement.style.backgroundColor = bg;
        document.body.style.backgroundColor = bg;
        document.body.style.color = fg;
        document.documentElement.style.colorScheme = light ? "light" : "dark";
        document.getElementById("root")?.style.setProperty("background-color", bg);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, toggleTheme}}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
