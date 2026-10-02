import { useNavigate } from "react-router-dom";
import { HERO as H } from "../../data/hero";
import SmartImg from "../../lib/SmartImg";

function CardShell({ children, className = "" }) {
  return (
    <div className={`w-[210px] rounded-[6px] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${className}`}>
      {children}
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const [c1, c2, c3, c4] = H.cards;

  return (
    <section id="home" className="hero-learnloop overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="pb-14">
          <h1 className="text-[#111] font-medium tracking-[-0.02em] leading-[1.1] text-[40px] sm:text-[56px]">
            {H.titleLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h1>
          <p className="text-[#333] text-[16px] leading-[1.5] mt-5 max-w-[420px]">{H.subtitle}</p>
          <button
            onClick={() => navigate(H.ctaTo)}
            className="mt-7 rounded-[5px] bg-[#F59300] text-white text-[14px] font-semibold px-[22px] py-[14px] hover:bg-[#E08600] transition"
          >
            {H.ctaText}
          </button>

          <div className="flex items-start gap-7 mt-10">
            {H.stats.map((s) => (
              <div key={s.value}>
                <div className="text-[#111] font-medium text-[28px] leading-none">{s.value}</div>
                <div className="text-[#666] text-[12px] leading-[1.3] mt-2">
                  {s.labelLines.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[440px] sm:h-[500px] lg:h-[580px]">
          <div className="absolute top-6 right-0 z-10 flex flex-col gap-2">
            <CardShell className="float-soft bg-gradient-to-br from-[#E6F7B5] to-[#D4F08A]">
              <div className="flex items-center gap-2">
                <img src={H.avatarImg} alt="" className="w-7 h-7 shrink-0 rounded-full object-cover" />
                <p className="text-[10px] font-bold text-[#111] leading-tight">{c1.title}</p>
              </div>
              <p className="text-[9px] text-[#111]/70 leading-snug mt-1.5">{c1.desc}</p>
              <button
                onClick={() => navigate(c1.actionTo)}
                className="mt-2 rounded-[4px] bg-white text-[#111] text-[10px] font-bold px-3.5 py-1.5 shadow-sm hover:shadow transition"
              >
                {c1.action}
              </button>
            </CardShell>

            <CardShell className="float-soft-late bg-white/70 backdrop-blur border border-white/60">
              <div className="flex items-center gap-2">
                <img src={H.avatarImg} alt="" className="w-6 h-6 shrink-0 rounded-full object-cover" />
                <p className="text-[10px] font-semibold text-[#111] leading-snug">{c2.title}</p>
              </div>
            </CardShell>

            <CardShell className="float-soft bg-white/70 backdrop-blur border border-white/60">
              <p className="text-[10px] font-bold text-[#111] leading-snug">🔥 {c3.title}</p>
            </CardShell>

            <CardShell className="bg-white/50 backdrop-blur border border-white/40 opacity-40">
              <p className="text-[10px] text-[#111]/60 leading-snug">{c4.title}</p>
            </CardShell>
          </div>

          <SmartImg
            local={H.personImg}
            remote={H.personFallback}
            alt={H.personAlt}
            eager
            className="absolute bottom-[-24px] right-[100px] sm:right-[130px] z-20 h-[420px] sm:h-[500px] lg:h-[560px] w-auto max-w-none object-contain"
          />
        </div>
      </div>
    </section>
  );
}
