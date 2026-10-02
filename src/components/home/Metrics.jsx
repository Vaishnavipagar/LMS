import { useNavigate } from "react-router-dom";
import { METRICS as M } from "../../data/metrics";

export default function Metrics() {
  const navigate = useNavigate();

  return (
    <section id="metrics" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14 text-center">
        <span className="inline-block text-[11px] font-semibold text-[#111]/60 bg-[#F1F1F1] rounded-full px-4 py-1.5">
          {M.eyebrow}
        </span>
        <h2 className="text-[32px] font-medium tracking-tight text-[#111] mt-4 leading-tight">
          The Numbers Speak
          <br />
          for Themselves
        </h2>
        <p className="text-[12px] text-[#555] leading-relaxed mt-3 max-w-xl mx-auto">{M.desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10 max-w-2xl mx-auto text-left">
          {M.stats.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate("/courses")}
              style={{ backgroundColor: s.bg }}
              className="rounded-[10px] border border-black/[0.06] p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition text-left"
            >
              <span className="w-10 h-10 shrink-0 rounded-lg bg-white/85 grid place-items-center text-[17px]">
                {s.icon}
              </span>
              <span>
                <span className="block text-[20px] font-medium text-[#111]">{s.value}</span>
                <span className="block text-[11px] text-[#555] mt-0.5">{s.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
