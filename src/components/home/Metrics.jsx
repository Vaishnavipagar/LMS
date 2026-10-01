import { useNavigate } from "react-router-dom";
import { METRICS as M } from "../../data/metrics";

export default function Metrics() {
  const navigate = useNavigate();

  return (
    <section id="metrics" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14 text-center">
        <span className="inline-block text-[11px] font-bold text-[#191817]/60 border border-[#191817]/15 rounded-full px-4 py-1.5">
          {M.eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#191817] mt-4">{M.title}</h2>
        <p className="text-[12px] text-[#6B655C] leading-relaxed mt-3 max-w-xl mx-auto">{M.desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10 max-w-3xl mx-auto text-left">
          {M.stats.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate("/courses")}
              style={{ backgroundColor: s.bg }}
              className="rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition text-left"
            >
              <span className="w-10 h-10 shrink-0 rounded-full bg-white/80 grid place-items-center text-[#F5820B] font-black">
                ★
              </span>
              <span>
                <span className="block text-xl font-extrabold text-[#191817]">{s.value}</span>
                <span className="block text-[11px] font-semibold text-[#191817]/60 mt-0.5">{s.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
