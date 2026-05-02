const HomePage = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 text-white">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-pink-400">오늘의 인기 LP</p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">
          지금 가장 많이 듣는 앨범
        </h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="overflow-hidden rounded-md border border-gray-800 bg-[#151515]">
          <div className="aspect-square bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300" />
          <div className="p-4">
            <h2 className="font-bold">Summer Drive</h2>
            <p className="mt-1 text-sm text-gray-400">Mellow Tape</p>
          </div>
        </article>

        <article className="overflow-hidden rounded-md border border-gray-800 bg-[#151515]">
          <div className="aspect-square bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500" />
          <div className="p-4">
            <h2 className="font-bold">Blue Hour</h2>
            <p className="mt-1 text-sm text-gray-400">Night Runner</p>
          </div>
        </article>

        <article className="overflow-hidden rounded-md border border-gray-800 bg-[#151515]">
          <div className="aspect-square bg-gradient-to-br from-emerald-400 via-teal-500 to-slate-700" />
          <div className="p-4">
            <h2 className="font-bold">Forest Radio</h2>
            <p className="mt-1 text-sm text-gray-400">June Field</p>
          </div>
        </article>

        <article className="overflow-hidden rounded-md border border-pink-500/50 bg-[#151515]">
          <div className="aspect-square bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500" />
          <div className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-sm bg-pink-500 px-2 py-0.5 text-xs font-bold">
                PREMIUM
              </span>
            </div>
            <h2 className="font-bold">Private Press</h2>
            <p className="mt-1 text-sm text-gray-400">회원 전용 앨범</p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default HomePage;
