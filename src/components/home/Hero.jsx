import { useNavigate } from "react-router-dom";
import { HERO as H } from "../../data/hero";

export default function Hero() {
  const navigate = useNavigate();
  const [primary, secondary] = H.stats;

  return (
    <section id="home" className="hero-forest overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <p className="text-white/50 text-[11px] font-medium tracking-[0.22em]">
            [LEARNLOOP 2025]
          </p>
          <h1 className="text-white font-semibold tracking-[-0.04em] leading-[0.98] text-[52px] sm:text-[88px] mt-5">
            {H.titleLines.join(" ")}
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.6] mt-6 max-w-[420px]">
            {H.subtitle}
          </p>
          <button
            onClick={() => navigate(H.ctaTo)}
            className="mt-7 rounded-full bg-white text-black text-[14px] font-semibold px-[26px] py-[14px] hover:bg-neutral-200 transition"
          >
            {H.ctaText}
          </button>

          <div className="flex items-start gap-8 mt-10">
            {[primary, secondary].map((s) => (
              <div key={s.value}>
                <div className="text-white font-medium text-[26px] leading-none">{s.value}</div>
                <div className="text-white/50 text-[12px] leading-[1.35] mt-2">
                  {s.labelLines.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col items-end gap-5">
          <div className="w-[240px] rounded-2xl bg-[#F2F3EC] text-[#111] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-[#6b7c2e]">
                <span className="w-2 h-2 rounded-full bg-[#9ab53f]" />
                LEARNLOOP
              </span>
              <span className="text-[#111]/30 text-sm leading-none">···</span>
            </div>
            <div className="text-[40px] font-semibold leading-none mt-3">92%</div>
            <div className="text-[11px] text-[#111]/55 mt-1">Completion Rate</div>
            <div className="h-1.5 rounded-full bg-black/10 mt-3 overflow-hidden">
              <div className="h-full w-[92%] rounded-full bg-[#9ab53f]" />
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="mt-4 rounded-lg bg-white text-[#111] text-[11px] font-bold px-4 py-2 shadow-sm hover:shadow transition"
            >
              Book a meeting
            </button>
          </div>

          <div className="w-[240px] space-y-4 text-white">
            <div className="flex items-start gap-3">
              <span className="text-[#cfe08a] text-lg leading-none mt-0.5">✳</span>
              <div>
                <div className="text-[15px] font-semibold">92% Trusted</div>
                <div className="text-white/55 text-[12px] mt-0.5">50k+ Active Learners</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 mt-0.5 shrink-0 rounded-full border border-white/50 grid place-items-center text-[10px] text-white/80">
                ◉
              </span>
              <div>
                <div className="text-[15px] font-semibold">500+</div>
                <div className="text-white/55 text-[12px] mt-0.5">Expert Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
