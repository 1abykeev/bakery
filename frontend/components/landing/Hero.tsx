// frontend/src/components/landing/Hero.tsx

import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          Бизнести жөнөкөй башкаруу
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-800 leading-tight mb-6">
          Бизнесиңизди
          <br />
          <span className="text-amber-500">чаташсыз башкарыңыз</span>
        </h1>

        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Кардарларды жазуу, кызматкерлерди башкаруу жана кирешени
          көзөмөлдөө үчүн жөнөкөй жана ыңгайлуу система — баары бир жерде.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition shadow-lg shadow-amber-200"
          >
            Бекер баштоо
          </Link>
          <a
            href="#features"
            className="text-stone-600 hover:text-stone-800 font-medium text-lg px-8 py-4 rounded-2xl border border-stone-200 hover:border-stone-300 transition"
          >
            Көбүрөөк билүү
          </a>
        </div>

        <p className="text-stone-400 text-sm mt-10">
          Буга чейин{" "}
          <span className="text-stone-600 font-semibold">500+ ишкер</span>{" "}
          колдонуп жатат
        </p>
      </div>
    </section>
  );
}