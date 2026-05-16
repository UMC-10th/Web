const LpCardSkeleton = () => {
  return (
    <div className="block rounded-xl overflow-hidden bg-[#242424]">
      {/* Image Skeleton */}
      <div className="aspect-video w-full bg-white/5 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col gap-2">
        {/* Title Skeleton */}
        <div className="h-6 bg-white/5 rounded-md animate-pulse w-3/4" />

        {/* Meta Skeleton */}
        <div className="flex justify-between items-center gap-2">
          <div className="h-4 bg-white/5 rounded-md animate-pulse w-24" />
          <div className="h-4 bg-white/5 rounded-md animate-pulse w-12" />
        </div>
      </div>
    </div>
  );
};

export default LpCardSkeleton;
