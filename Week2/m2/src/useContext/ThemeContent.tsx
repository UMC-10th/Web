import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <div className="p-4">
            <h1
                className={clsx(
                    "text-2xl font-bold",
                    isLightMode ? "!text-neutral-900" : "!text-white",
                )}
            >
                {isLightMode ? "라이트 모드" : "다크 모드"}
            </h1>
            <p
                className={clsx(
                    "mt-2",
                    isLightMode ? "!text-neutral-900" : "!text-white",
                )}
            >
                현재 테마는 {isLightMode ? "라이트 모드" : "다크 모드"}입니다.
            </p>
        </div>
    );
}