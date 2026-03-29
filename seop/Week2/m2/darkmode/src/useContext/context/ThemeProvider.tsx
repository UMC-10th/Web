import { createContext, useContext, useState, type PropsWithChildren } from "react";

// enum 대신 const 객체로 변경
export const THEME = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
} as const;

// typeof를 사용해 객체(THEME)가 아닌 진짜 타입(TTheme)으로 만들기
export type TTheme = typeof THEME.LIGHT | typeof THEME.DARK;

interface IThemeContext {
    theme: TTheme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

    const toggleTheme = () : void => {
        // 리턴 타입을 THEME이 아니라 TTheme으로 변경
        setTheme((prevTheme): TTheme => 
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
        );
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}