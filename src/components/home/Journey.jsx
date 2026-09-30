import { useEffect, useRef, useState } from "react";
import { JOURNEY } from "../../data/journey";

export default function Journey() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="journey-blob-1 absolute -top-24 -left-24 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="journey-blob-2 absolute top-1/3 -right-28 w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full bg-yellow-100/40 blur-3xl" />
        <div className="journey-blob-1 absolute -bottom-32 left-1/3 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-teal-50/80 blur-3xl" />
      </div>
      <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <h2 className={`text-2xl sm:text-[28px] font-extrabold tracking-tight leading-tight reveal${shown ? " reveal-in" : ""}`}>
          {JOURNEY.titleLines.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </h2>
        <p
          className={`text-[11px] text-gray-400 mt-3 max-w-md leading-relaxed reveal${shown ? " reveal-in" : ""}`}
          style={{ transitionDelay: "100ms" }}
        >
          {JOURNEY.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {JOURNEY.steps.map((s, i) => (
            <div
              key={s.n}
              className={`relative reveal${shown ? " reveal-in" : ""}`}
              style={{ transitionDelay: `${150 + i * 130}ms` }}
            >
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
