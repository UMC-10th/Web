const SkeletonCard = () => {
    return (
        <div
            aria-hidden="true"
            className="relative aspect-square overflow-hidden bg-zinc-800 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
        />
    );
};

export default SkeletonCard;
