const CommentSkeleton = () => {
    return (
        <div aria-hidden="true" className="flex gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-700 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
            <div className="w-full space-y-2">
                <div className="relative h-5 w-32 overflow-hidden rounded bg-zinc-700 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                <div className="relative h-5 w-full max-w-xl overflow-hidden rounded bg-zinc-700 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
            </div>
        </div>
    );
};

export default CommentSkeleton;
