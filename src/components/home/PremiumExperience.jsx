import { useNavigate } from "react-router-dom";
import { PREMIUM } from "../../data/premium";

export default function PremiumExperience() {
  const navigate = useNavigate();

  return (
    <section id="instructors" className="bg-white overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        <div>
          <p className="text-[13px] font-extrabold tracking-wide text-gray-400 flex items-center gap-2.5">
            <span className="w-8 h-px bg-gray-300 inline-block" /> About Us
          </p>
          <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight leading-tight mt-3">
            {PREMIUM.titleLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h2>

          <div className="mt-7 rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-4 max-w-lg">
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold px-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
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
          </div>
        </div>

        <div className="lg:pt-9">
          <h3 className="font-extrabold text-[15px]">{PREMIUM.heading}</h3>
          <ul className="mt-5 space-y-4">
            {PREMIUM.points.map((c) => (
              <li key={c} className="flex gap-3.5">
                <span className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-gray-100 grid place-items-center text-[#0a4a3c] text-sm">◉</span>
                <p className="text-[13px] text-gray-600 leading-relaxed">{c}</p>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/courses")} className="mt-6 rounded-lg border-2 border-[#0a4a3c] text-[#0a4a3c] text-[13px] font-extrabold px-6 py-3 hover:bg-[#0a4a3c] hover:text-white transition">
            Explore live classes
          </button>
        </div>
      </div>
    </section>
  );
}
