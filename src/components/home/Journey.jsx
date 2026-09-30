import { JOURNEY } from "../../data/journey";

export default function Journey() {
  return (
    <section className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight leading-tight">
          {JOURNEY.titleLines.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </h2>
        <p className="text-[11px] text-gray-400 mt-3 max-w-md leading-relaxed">{JOURNEY.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {JOURNEY.steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full border-2 border-[#0a4a3c] text-[#0a4a3c] grid place-items-center text-[12px] font-extrabold">
                  {s.n}
                </span>
                <span className="hidden md:block flex-1 border-t border-dashed border-gray-300" />
              </div>
              <h3 className="font-extrabold text-[15px] mt-5">{s.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed mt-2 max-w-[260px]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
