import { BENEFITS as B } from "../../data/benefits";

export default function Benefits() {
  return (
    <section id="benefits" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-block text-[11px] font-bold text-[#191817]/60 border border-[#191817]/15 rounded-full px-4 py-1.5">
            {B.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#191817] mt-4">{B.title}</h2>
          <p className="text-[12px] text-[#6B655C] leading-relaxed mt-3">{B.desc}</p>
        </div>

        <div className="space-y-6 mt-10">
          {B.cards.map((c) => (
            <article
              key={c.title}
              style={{ backgroundColor: c.bg }}
              className="rounded-[24px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            >
              <div className={c.imgLeft ? "order-1" : "order-1 md:order-2"}>
                <img src={c.img} alt={c.imgAlt} loading="lazy" className="block w-full h-56 sm:h-64 object-cover rounded-2xl" />
              </div>
              <div className={c.imgLeft ? "order-2" : "order-2 md:order-1"}>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#191817]/55">
                  {c.label}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#191817] mt-2">{c.title}</h3>
                <p className="text-[12px] text-[#191817]/65 leading-relaxed mt-3">{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
