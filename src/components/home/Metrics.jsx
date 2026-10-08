import { WHO as W } from "../../data/metrics";
import SmartImg from "../../lib/SmartImg";
import { TrendIcon, BoltIcon, DotIcon } from "../icons";

const TAG_ICONS = {
  "Completion Rate": TrendIcon,
  "Skill Growth": BoltIcon,
  "Active Learners": DotIcon,
};

export default function Metrics() {
  return (
    <section id="metrics" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12">
        <div>
          {W.kickers.map((k) => (
            <p key={k} className="text-[10px] font-bold tracking-[0.18em] text-[#111]/40 flex items-center gap-2 mt-3 first:mt-0">
              <span className="w-4 h-px bg-[#9ab53f] inline-block" />
              {k}
            </p>
          ))}

          <div className="flex items-center gap-3 mt-8">
            <SmartImg
              local="/images/hero.png"
              remote="/images/hero.png"
              alt={W.quote.name}
              className="w-11 h-11 rounded-full object-cover object-top bg-[#0B2417]"
            />
            <div>
              <p className="text-[13px] font-bold text-[#111]">{W.quote.name}</p>
              <p className="text-[11px] text-[#111]/50">{W.quote.role}</p>
            </div>
          </div>
          <p className="text-[12.5px] text-[#333] leading-relaxed mt-4 max-w-[300px]">
            “{W.quote.text}”
          </p>

          <p className="text-[11px] font-semibold text-[#111] mt-8">{W.trustedLabel}</p>
          <p className="text-[#F5A623] text-[13px] mt-1.5 tracking-tight">
            ★★★★★ <span className="text-[#111] font-bold ml-1">{W.rating}</span>
          </p>
        </div>

        <div>
          <h2 className="text-[24px] sm:text-[28px] font-medium tracking-tight text-[#111] leading-[1.35] max-w-[520px]">
            {W.heading}
          </h2>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 items-start max-w-[840px]">
            {W.stats.map((s, i) => (
              <div
                key={s.tag}
                className={`rounded-[20px] overflow-hidden ${
                  i === 2
                    ? "stripe-card bg-black text-white min-h-[230px] md:min-h-[310px] p-4 flex flex-col"
                    : "bg-white text-[#111] border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] min-h-[210px] md:min-h-[230px] flex flex-col"
                } ${i === 1 ? "md:min-h-[270px]" : ""}`}
              >
                {i === 0 && (
                  <div className="stripe-card bg-black h-16 w-full" aria-hidden />
                )}
                {i === 1 && (
                  <div className="stripe-card bg-black h-32 sm:h-36 w-full" aria-hidden />
                )}
                <div className={`flex items-center gap-2.5 ${i === 2 ? "mt-auto" : "p-4 pb-0"}`}>
                  <span className={`text-[40px] font-semibold leading-none ${i === 2 ? "text-white" : "text-[#111]"}`}>
                    {s.value}
                  </span>
                  {s.badge && (
                    <span
                      className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${
                        s.badgeTone === "green" ? "bg-[#8ac926] text-white" : "bg-[#b678f0] text-white"
                      }`}
                    >
                      {s.badge}
                    </span>
                  )}
                </div>
                <p className={`text-[13px] leading-snug px-4 mt-2.5 ${i === 2 ? "text-white/85" : "text-[#111]/80"}`}>
                  {s.desc}
                </p>
                <div className="flex items-center gap-2 px-4 mt-auto pt-4 pb-4">
                  {(() => {
                    const TagIcon = TAG_ICONS[s.tag] || DotIcon;
                    return (
                      <span className={`w-7 h-7 rounded-full grid place-items-center ${i === 2 ? "bg-white/15 text-white" : "bg-black/[0.06] text-[#111]/60"}`}>
                        <TagIcon size={12} />
                      </span>
                    );
                  })()}
                  <span className={`text-[12px] ${i === 2 ? "text-white/70" : "text-[#111]/50"}`}>{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
