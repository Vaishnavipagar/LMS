import { MISSION as M } from "../../data/mission";

export default function Mission() {
  return (
    <section id="mission" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <img src={M.img} alt={M.imageAlt} loading="lazy" className="block w-full h-72 sm:h-80 object-cover rounded-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191817]">{M.title}</h2>
          <p className="text-[12px] text-[#6B655C] leading-relaxed mt-4">{M.text}</p>
          <ul className="mt-6 space-y-4">
            {M.points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-[#F5820B] text-white grid place-items-center text-[11px] font-black">
                  ✓
                </span>
                <span className="text-[13px] font-bold text-[#191817] leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
