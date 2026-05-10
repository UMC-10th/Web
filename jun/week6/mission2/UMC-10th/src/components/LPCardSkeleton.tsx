export const LPCardSkeleton = () => {
  return (
    <div className="border border-[#333] rounded-xl p-4 bg-[#111] flex flex-col gap-2 animate-pulse">
      <div className="w-full aspect-square bg-[#222] rounded-lg"></div>
      <div className="h-5 bg-[#222] rounded w-3/4 mt-2"></div>
    </div>
  );
};