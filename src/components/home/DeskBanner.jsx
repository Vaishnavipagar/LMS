import { useNavigate } from "react-router-dom";
import { BENEFITS as B } from "../../data/benefits";
import { WHO as W } from "../../data/metrics";
import SmartImg from "../../lib/SmartImg";

const MINI = [
  { title: "TRUSTED PLATFORM", desc: "Loved by 50k+ learners worldwide." },
  { title: "TEAM WORKSPACE", desc: "Study groups with shared boards." },
  { title: "BUSINESS GROWTH", desc: "Skills that raise careers." },
];

export default function DeskBanner() {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#111]/40 flex items-center gap-2">
            <span className="w-4 h-px bg-[#9ab53f] inline-block" />
            WHY CHOOSE US
          </p>
          <h2 className="text-[28px] sm:text-[34px] font-medium tracking-tight text-[#111] leading-[1.25] mt-4 max-w-[420px]">
            Everything your learning needs to scale with confidence.
          </h2>
          <button
            onClick={() => navigate("/courses")}
            className="mt-6 rounded-full bg-black text-white text-[13px] font-medium px-6 py-3 hover:bg-neutral-800 transition"
          >
            Join the waitlist
          </button>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-[480px]">
            {MINI.map((m, i) => (
              <div key={m.title}>
                <SmartImg
                  local={B.cards[i % B.cards.length].local}
                  remote={B.cards[i % B.cards.length].remote}
                  alt={m.title}
                  className="block w-12 h-12 object-cover rounded-xl"
                />
                <p className="text-[9px] font-bold tracking-wider text-[#111] mt-2.5">{m.title}</p>
                <p className="text-[10px] text-[#111]/50 mt-1 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <SmartImg
            local={B.cards[2].local}
            remote={B.cards[2].remote}
            alt={B.cards[2].imgAlt}
            className="block w-full h-[340px] sm:h-[420px] object-cover rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          />
          <div className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-auto sm:w-[300px] rounded-2xl bg-white/95 backdrop-blur p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#111]/50">Avg Completion</span>
              <span className="text-[10px] font-bold text-[#6b9e2e]">▲ 92%</span>
            </div>
            <div className="text-[30px] font-semibold text-[#111] leading-none mt-1">
                            {W.stats[0].value}
            </div>
            <div className="flex items-end gap-1.5 h-14 mt-3">
              {[35, 55, 40, 70, 60, 85, 75, 95, 68, 88, 78, 98].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-sm ${i % 3 === 0 ? "bg-[#9ab53f]" : "bg-black/10"}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-[#111]/50 mt-3 leading-snug">
              Track your progress with live dashboards built for learners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
