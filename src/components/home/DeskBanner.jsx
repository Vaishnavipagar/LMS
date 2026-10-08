import { useNavigate } from "react-router-dom";
import { BENEFITS as B } from "../../data/benefits";
import { WHO as W } from "../../data/metrics";
import SmartImg from "../../lib/SmartImg";

const FEATURES = ["Trusted Platform", "Team Workspace", "Business Growth"];

export default function DeskBanner() {
  const navigate = useNavigate();
  const stat = W.stats[0];

  return (
    <section className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="px-5 sm:px-8 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:pr-10 py-14 lg:py-20">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-[#111] border border-black/15 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ab53f] inline-block" />
            WHY CHOOSE US
          </span>
          <h2 className="text-[34px] sm:text-[44px] font-medium tracking-tight text-[#111] leading-[1.15] mt-6 max-w-[480px]">
            Everything your learning needs to scale with confidence.
          </h2>
          <button
            onClick={() => navigate("/courses")}
            className="mt-7 rounded-full bg-black text-white text-[13px] font-medium px-7 py-3.5 hover:bg-neutral-800 transition"
          >
            Browse courses
          </button>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-[560px]">
            {FEATURES.map((f) => (
              <p key={f} className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#111] uppercase">
                {f}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5 sm:gap-7 mt-10 max-w-[560px]">
            <div className="rounded-2xl bg-black text p-4 sm:p-5 w-[132px] sm:w-[150px] shrink-0">
              <div className="flex items-start justify-between">
                <span className="grid grid-cols-2 gap-[3px]" aria-hidden>
                  <span className="w-2.5 h-2.5 bg-[#9ab53f] rounded-[2px]" />
                  <span className="w-2.5 h-2.5 bg-[#9ab53f] rounded-[2px] opacity-70" />
                  <span className="w-2.5 h-2.5 bg-[#9ab53f] rounded-[2px] opacity-40" />
                  <span className="w-2.5 h-2.5 bg-transparent" />
                </span>
                <span className="text-[8px] font-bold tracking-widest text-white/80">LEARNLOOP</span>
              </div>
              <p className="text-[9px] font-bold tracking-widest text-[#9ab53f] mt-5">DAY</p>
              <p className="text-[30px] font-semibold text-white leading-none mt-1">{stat.value}</p>
              <p className="text-[10px] text-white/60 mt-1.5">Avg Completion</p>
            </div>

            <p className="text-[15px] sm:text-[17px] font-medium text-[#111] leading-snug">
              Track your progress with live dashboards built for learners.
            </p>

            <button
              onClick={() => navigate("/courses")}
              className="relative shrink-0 w-20 sm:w-24 h-28 sm:h-32 rounded-2xl overflow-hidden group"
              aria-label="Preview courses"
            >
              <SmartImg
                local={B.cards[1].local}
                remote={B.cards[1].remote}
                alt="Course preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="w-9 h-9 rounded-full bg-white/85 grid place-items-center text-[#111] text-sm group-hover:scale-110 transition">
                  ▶
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 sm:px-10 py-4">
          <div className="relative w-full max-w-[400px]">
            <div className="rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
              <SmartImg
                local={B.cards[2].local}
                remote={B.cards[2].remote}
                alt={B.cards[2].imgAlt}
                className="block w-full aspect-[4/5] object-cover blur-lg scale-[1.04]"
              />
            </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[310px] rounded-2xl bg-white/95 backdrop-blur p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#111]/60">Avg Completion</span>
              <span className="text-[11px] font-bold text-[#6b9e2e]">▲ {stat.value}</span>
            </div>
            <p className="text-[38px] font-semibold text-[#111] leading-none mt-2">{stat.value}</p>
            <div className="flex items-end gap-1.5 h-16 mt-4">
              {[35, 55, 40, 70, 60, 85, 75, 95, 68, 88, 78, 98].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-sm ${i % 3 === 0 ? "bg-[#9ab53f]" : "bg-black/10"}`}
                />
              ))}
            </div>
            <p className="text-[11px] text-[#111]/55 mt-4 leading-snug">
              Track your progress with live dashboards built for learners.
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
