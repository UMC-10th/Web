export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-pink-400 rounded-full animate-spin" />
    </div>
  );
}