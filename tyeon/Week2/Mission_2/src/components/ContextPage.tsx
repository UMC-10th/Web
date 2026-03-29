import ThemeContent from "./ThemeContent";
import NavBar from "./NavBar";
import { ThemeProvider } from "../context/ThemeProvider";

function ContextPage() {
    return (
    <ThemeProvider>
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <NavBar />
            <main className='flex-1 w-full'>
                <ThemeContent />
            </main>
        </div>
    </ThemeProvider>
    );
}

export default ContextPage;