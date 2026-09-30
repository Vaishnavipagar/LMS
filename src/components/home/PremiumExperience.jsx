import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PREMIUM } from "../../data/premium";

export default function PremiumExperience() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);

  return (
    <section id="instructors" className="bg-white overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight leading-tight">
            {PREMIUM.titleLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h2>

          <div className="mt-8 rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-4 max-w-md">
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold px-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-auto">{muted ? "Muted" : "Live class"}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {PREMIUM.faces.map((f, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden h-24 bg-gray-100">
                  <img src={f} alt="class participant" loading="lazy" className="block w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/50 rounded px-1.5 py-0.5">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 mt-4">
              <button onClick={() => navigate("/courses")} className="rounded-full bg-[#0a4a3c] text-white text-[11px] font-bold px-5 py-2 hover:bg-[#0d5c4a] transition">
                Present
              </button>
              <a href={`tel:${PREMIUM.phone.replace(/\s/g, "")}`} className="rounded-full bg-[#e5487f] text-white text-[11px] font-bold px-5 py-2 hover:brightness-110 transition">
                Call
              </a>
              <button
                onClick={() => setMuted(!muted)}
                aria-label="toggle mic"
                className={`ml-auto w-9 h-9 rounded-full border grid place-items-center shadow transition ${muted ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}
              >
                {muted ? "✕" : "◉"}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-[15px]">{PREMIUM.heading}</h3>
          <ul className="mt-6 space-y-5">
            {PREMIUM.points.map((c) => (
              <li key={c} className="flex gap-3.5">
                <span className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-gray-100 grid place-items-center text-[#0a4a3c] text-sm">◉</span>
                <p className="text-[13px] text-gray-600 leading-relaxed">{c}</p>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/courses")} className="mt-7 rounded-lg border-2 border-[#0a4a3c] text-[#0a4a3c] text-[13px] font-extrabold px-6 py-3 hover:bg-[#0a4a3c] hover:text-white transition">
            Explore live classes
          </button>
        </div>
      </div>
    </section>
  );
}
