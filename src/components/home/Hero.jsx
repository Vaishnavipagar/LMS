import { useNavigate } from "react-router-dom";
import { HERO as H } from "../../data/hero";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="bg-[#F6F0E6] overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-[#191817] font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl">
            {H.titleLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h1>
          <p className="text-[#6B655C] text-[13px] leading-relaxed mt-5 max-w-sm">{H.subtitle}</p>
          <button
            onClick={() => navigate(H.ctaTo)}
            className="mt-7 rounded-full bg-[#F5820B] text-white text-[13px] font-bold px-8 py-3.5 hover:bg-[#E06F00] hover:-translate-y-0.5 transition shadow-[0_10px_25px_rgba(245,130,11,0.35)]"
          >
            {H.ctaText}
          </button>

          <div className="flex items-center gap-8 mt-9">
            {H.stats.map((s) => (
              <div key={s.label}>
                <div className="text-[#191817] font-extrabold text-lg leading-none">{s.value}</div>
                <div className="text-[#6B655C] text-[11px] mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src={H.image}
              alt={H.imageAlt}
              loading="eager"
              className="block w-[300px] sm:w-[380px] h-[380px] sm:h-[440px] object-cover rounded-[28px]"
            />
            <div className="float-soft absolute -left-4 sm:-left-8 top-10 max-w-[170px] rounded-xl bg-[#DFF3D2] border border-white/60 shadow-lg p-3">
              <p className="text-[11px] font-extrabold text-[#191817]">{H.cards[0].title}</p>
              <p className="text-[10px] text-[#191817]/60 mt-0.5">{H.cards[0].desc}</p>
            </div>
            <div className="float-soft-late absolute -right-3 sm:-right-6 bottom-16 max-w-[160px] rounded-xl bg-[#FFF3C4] border border-white/60 shadow-lg p-3">
              <p className="text-[11px] font-extrabold text-[#191817]">{H.cards[1].title}</p>
              <p className="text-[10px] text-[#191817]/60 mt-0.5">{H.cards[1].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
