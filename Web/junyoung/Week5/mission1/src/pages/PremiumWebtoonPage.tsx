import { Link } from 'react-router-dom';

const PremiumWebtoonPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 text-white">
      <section className="grid gap-8 md:grid-cols-[360px_1fr] md:items-center">
        <div className="aspect-square rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-2xl shadow-pink-950/40" />

        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-sm bg-pink-500 px-2 py-1 text-xs font-bold">
            PREMIUM
          </span>
          <h1 className="text-3xl font-bold md:text-5xl">Private Press</h1>
          <p className="text-lg text-gray-300">The Velvet Room</p>
          <p className="max-w-2xl leading-7 text-gray-400">
            깊은 밤에 어울리는 재즈, 소울, 시티팝 트랙을 모은 회원 전용
            플레이리스트입니다.
          </p>
          <button className="w-fit rounded-md bg-pink-500 px-5 py-2 text-sm font-bold transition-colors hover:bg-pink-600">
            재생하기
          </button>
        </div>
      </section>

      <section className="rounded-md border border-gray-800 bg-[#151515]">
        {[
          ['01', 'After Midnight', '03:42'],
          ['02', 'Slow Needle', '04:18'],
          ['03', 'Velvet Window', '03:56'],
          ['04', 'Last Train Home', '04:31'],
        ].map(([track, title, time]) => (
          <div
            key={track}
            className="grid grid-cols-[48px_1fr_64px] items-center border-b border-gray-800 px-5 py-4 last:border-b-0"
          >
            <span className="text-sm text-gray-500">{track}</span>
            <span className="font-medium">{title}</span>
            <span className="text-right text-sm text-gray-500">{time}</span>
          </div>
        ))}
      </section>

      <Link
        to="/"
        className="w-fit rounded-md border border-gray-600 px-4 py-2 text-sm font-bold text-gray-200 transition-colors hover:border-gray-300 hover:text-white"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
};

export default PremiumWebtoonPage;
