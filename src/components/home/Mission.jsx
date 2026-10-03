import { MISSION as M } from "../../data/mission";
import SmartImg from "../../lib/SmartImg";

export default function Mission() {
  return (
    <section id="mission" className="bg-black">
      <div className="bg-black text-white overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14 text-center">
          <span className="inline-block text-[10px] font-semibold tracking-[0.2em] text-white/50 border border-white/15 rounded-full px-4 py-1.5">
            {M.pill}
          </span>
          <h2 className="text-[28px] sm:text-[36px] font-medium tracking-tight leading-[1.2] mt-5 max-w-[620px] mx-auto">
            {M.heading}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 text-left">
            <div className="relative rounded-2xl overflow-hidden h-[300px]">
              <SmartImg
                local="/images/hero.png"
                remote="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop"
                alt="Smiling LearnLoop learner"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 text-[10px] font-bold tracking-wide text-white bg-white/15 backdrop-blur rounded-full px-3 py-1.5">
                ◐ {M.photoCaption}
              </span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-2xl">
                ✳
              </span>
            </div>

            <div className="rounded-2xl bg-[#A8C256] text-[#111] p-6 h-[300px] flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold">{M.greenCardTitle}</span>
                <span className="text-[#111]/40 text-sm leading-none">···</span>
              </div>
              <div className="flex items-end gap-8 mt-5">
                {M.greenCardStats.map((s) => (
                  <div key={s.label}>
                    <div className="text-[30px] font-semibold leading-none">✳ {s.value}</div>
                    <div className="text-[11px] text-[#111]/60 mt-1.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-auto space-y-2">
                <div className="h-1.5 rounded-full bg-black/15 overflow-hidden">
                  <div className="h-full w-[92%] rounded-full bg-[#111]/70" />
                </div>
                <div className="h-1.5 rounded-full bg-black/15 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-[#111]/40" />
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-[300px]">
              <SmartImg
                local="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop"
                remote="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop"
                alt="The Live LearnLoop Classroom"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-[13px] font-semibold leading-snug">
                {M.photoCaption2}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {M.features.map((f) => (
              <div key={f.title}>
                <h3 className="text-[15px] font-semibold">{f.title}</h3>
                <p className="text-white/55 text-[12.5px] leading-relaxed mt-2.5 max-w-[300px]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
