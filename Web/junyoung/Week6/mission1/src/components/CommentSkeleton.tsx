const CommentSkeleton = () => {
  return (
    <div className="animate-pulse rounded-md border border-gray-800 bg-[#151515] p-4">
      <div className="h-4 w-24 rounded bg-gray-700" />
      <div className="mt-3 h-3 w-full rounded bg-gray-800" />
      <div className="mt-2 h-3 w-2/3 rounded bg-gray-800" />
    </div>
  );
};

export default CommentSkeleton;
