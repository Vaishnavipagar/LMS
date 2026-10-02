import { BENEFITS as B } from "../../data/benefits";
import SmartImg from "../../lib/SmartImg";

export default function Benefits() {
  return (
    <section id="benefits" className="bg-white">
      <div className="w-full max-w-[900px] mx-auto px-5 sm:px-8 pt-4 pb-20">
        <div className="text-center max-w-[480px] mx-auto">
          <span className="inline-block text-[12px] font-semibold text-[#111] bg-[#ECECEC] rounded-full px-5 py-2">
            {B.eyebrow}
          </span>
          <h2 className="text-[40px] font-medium tracking-tight text-[#111] mt-5 leading-tight">{B.title}</h2>
          <p className="text-[14px] text-[#555] leading-relaxed mt-4">{B.desc}</p>
        </div>

        <div className="space-y-6 mt-10">
          {B.cards.map((c) => (
            <article
              key={c.title}
              style={{ backgroundColor: c.bg }}
              className="rounded-[16px] p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            >
              <div className={c.imgLeft ? "order-1" : "order-1 md:order-2"}>
                <SmartImg
                  local={c.local}
                  remote={c.remote}
                  alt={c.imgAlt}
                  className="block w-full h-56 sm:h-64 object-cover rounded-[12px]"
                />
              </div>
              <div className={c.imgLeft ? "order-2" : "order-2 md:order-1"}>
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.12em] text-[#111]/70 bg-white rounded-full px-3 py-1">
                  {c.label}
                </span>
                <h3 className="text-[22px] font-medium tracking-tight text-[#111] mt-3">{c.title}</h3>
                <p className="text-[12px] text-[#8A6A4A] leading-relaxed mt-3">{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
