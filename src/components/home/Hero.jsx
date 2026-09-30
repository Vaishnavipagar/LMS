import { useNavigate } from "react-router-dom";
import { HERO } from "../../data/hero";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden bg-[#0a4a3c]">
      <div className="hero-rings pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-28 top-0 w-80 h-[480px] rounded-full bg-white/[0.04]" aria-hidden />

      <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 pt-28 lg:pt-32 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-white font-extrabold leading-[1.04] tracking-tight text-4xl sm:text-5xl lg:text-[56px]">
            {HERO.titleLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h1>
          <p className="text-white/70 text-[13px] leading-relaxed mt-5 max-w-sm">{HERO.subtitle}</p>
          <button
            onClick={() => navigate(HERO.ctaTo)}
            className="mt-7 rounded-md bg-[#f2d90d] px-8 py-3.5 text-[13px] font-extrabold text-black hover:brightness-110 hover:-translate-y-0.5 transition"
          >
            {HERO.ctaText}
          </button>

          <div className="flex items-center gap-8 sm:gap-10 mt-9">
            {HERO.stats.map((s) => (
              <div key={s.label}>
                <div className="text-[#f2d90d] font-extrabold text-lg leading-none">{s.value}</div>
                <div className="text-white/60 text-[11px] mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src={HERO.image}
              alt={HERO.imageAlt}
              className="block w-[300px] sm:w-[380px] h-[380px] sm:h-[460px] object-cover rounded-[28px]"
              loading="eager"
            />
            <div className="absolute left-10 -bottom-5 w-12 h-12 rounded-2xl bg-[#7ee2a8] grid place-items-center text-[#0a4a3c] text-xl shadow-lg">◐</div>
            <div className="absolute right-12 bottom-20 w-10 h-10 rounded-full border border-white/40 bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
