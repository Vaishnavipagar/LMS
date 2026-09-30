import { TESTIMONIALS as T } from "../../data/testimonials";

export default function Testimonials() {
  return (
    <section id="testimonial" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <p className="text-[11px] font-bold text-gray-400 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-300 inline-block" /> {T.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight mt-3">
            {T.titleLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h2>
          <p className="text-[12px] text-gray-500 leading-relaxed mt-4 max-w-sm">{T.desc}</p>

          <div className="mt-8 space-y-5">
            {T.stats.map(([n, l]) => (
              <div key={n} className="flex items-center gap-6">
                <span className="text-2xl font-extrabold w-16">{n}</span>
                <span className="text-[11px] text-gray-500 max-w-[180px] leading-snug">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative pb-10">
          <img src={T.image} alt={T.imageAlt} loading="lazy" className="block w-full h-[380px] sm:h-[440px] object-cover rounded-2xl" />
          <div className="absolute -bottom-2 left-4 right-4 sm:left-8 sm:right-auto sm:max-w-sm bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5">
            <span className="absolute left-0 top-5 bottom-5 w-1 rounded bg-[#f2d90d]" />
            <p className="text-[12px] text-gray-600 leading-relaxed">"{T.quote}"</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[12px] font-extrabold">{T.quoteName}</span>
              <span className="text-[#f5b301] text-[11px]">★★★★★ <span className="text-gray-400 font-semibold">{T.quoteMeta}</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
