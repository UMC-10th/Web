type LoadingStateProps = {
    variant?: "grid" | "detail";
};

const LoadingState = ({ variant = "grid" }: LoadingStateProps) => {
    if (variant === "detail") {
        return (
            <div className="min-h-screen bg-black px-6 py-24 text-white">
                <div className="mx-auto max-w-4xl rounded-lg bg-zinc-900 p-8">
                    <div className="mb-8 h-8 w-1/3 animate-pulse bg-zinc-800" />
                    <div className="mx-auto mb-8 aspect-square max-w-xl animate-pulse bg-zinc-800" />
                    <div className="space-y-3">
                        <div className="h-4 animate-pulse bg-zinc-800" />
                        <div className="h-4 w-4/5 animate-pulse bg-zinc-800" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-6 py-20">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="aspect-square animate-pulse bg-zinc-800" />
                ))}
            </div>
        </div>
    );
};

export default LoadingState;
