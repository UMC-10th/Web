export default function CommentSkeleton() {
  return (
    <div className="flex items-start gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-3 bg-gray-600 rounded w-24 mb-2" />
        <div className="h-3 bg-gray-600 rounded w-full" />
      </div>
    </div>
  );
}