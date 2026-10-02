import { MISSION as M } from "../../data/mission";
import SmartImg from "../../lib/SmartImg";

export default function Mission() {
  return (
    <section id="mission" className="bg-[#F5F5F5]">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-[45%_1fr] gap-10 items-center">
        <div>
          <SmartImg
            local={M.local}
            remote={M.remote}
            alt={M.imageAlt}
            className="block w-full h-72 sm:h-80 object-cover rounded-[16px]"
          />
        </div>
        <div>
          <h2 className="text-[24px] font-medium tracking-tight text-[#111]">{M.title}</h2>
          <p className="text-[12px] text-[#333] leading-relaxed mt-4">{M.text}</p>
          <ul className="mt-6 space-y-4">
            {M.points.map((p) => (
              <li key={p.text} className="flex items-start gap-3">
                <span className="text-[#F59300] text-[15px] leading-none mt-[1px]">{p.icon}</span>
                <span className="text-[12px] font-medium text-[#222] leading-snug">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
