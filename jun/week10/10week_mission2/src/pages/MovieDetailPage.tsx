import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetailPage() {
  // App.tsx의 path가 /movies/:movieId 이므로 키도 movieId 로 맞춰야 함
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-[#030a08] flex justify-center items-center px-4 py-10 font-sans overflow-hidden">
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div id="center" className="relative w-full max-w-[460px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex flex-col items-center gap-6 z-10 text-center">
        <header className="flex flex-col items-center">
          <span className="inline-block text-[10px] font-black tracking-[0.15em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase mb-4 shadow-sm">
            Cinema Database Detail
          </span>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Movie Detail Page</div>
        </header>

        <section className="bg-[#05110d]/90 border border-white/5 rounded-2xl p-6 w-full shadow-inner flex flex-col gap-2">
          <p className="text-4xl font-black text-emerald-400 tracking-tight animate-[pop_0.25s_ease-in-out]">#{movieId}</p>
          <h1 className="text-lg font-bold text-slate-200 leading-snug">
            번 영화의 상세 페이지를<br />성공적으로 페칭해옵니다.
          </h1>
        </section>

        <button
          onClick={() => navigate(-1)}
          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all active:scale-[0.97] shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2"
        >
          뒤로 가기
        </button>
      </div>
    </main>
  );
}
