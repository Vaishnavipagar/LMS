import { WHO as W } from "../../data/metrics";

export default function Metrics() {
  return (
    <section id="metrics" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12">
        <div>
          {W.kickers.map((k) => (
            <p key={k} className="text-[10px] font-bold tracking-[0.18em] text-[#111]/40 flex items-center gap-2 mt-3 first:mt-0">
              <span className="w-4 h-px bg-[#9ab53f] inline-block" />
              {k}
            </p>
          ))}

          <div className="flex items-center gap-3 mt-8">
            <span className="w-11 h-11 rounded-full bg-[#0B2417] text-white grid place-items-center text-[15px] font-bold">
              R
            </span>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {W.stats.map((s) => (
              <div
                key={s.label}
                className="stripe-card rounded-2xl bg-[#111] text-white p-5 min-h-[150px] flex flex-col justify-between"
              >
                <div className="text-[24px] font-semibold">
                  {s.value} <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#b678f0] ml-1" />
                </div>
                <p className="text-white/55 text-[11px] leading-snug mt-4">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
