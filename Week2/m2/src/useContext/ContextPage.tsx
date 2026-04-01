import clsx from "clsx";
import { ThemeProvider, THEME, useTheme } from "./context/ThemeProvider";
import Navbar from "./Navbar";
import ThemeContent from "./ThemeContent";

function Shell() {
    const { theme } = useTheme();
    const light = theme === THEME.LIGHT;

    return (
        <div
            className={clsx(
                "flex min-h-screen w-full flex-col",
                light ? "bg-white text-neutral-900" : "bg-gray-900 text-white",
            )}
        >
            <Navbar />
            <main className="w-full flex-1">
                <ThemeContent />
            </main>
        </div>
    );
}

export default function ContextPage() {
    return (
        <ThemeProvider>
            <Shell />
        </ThemeProvider>
    );
}
