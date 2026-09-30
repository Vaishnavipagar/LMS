import { useNavigate } from "react-router-dom";
import { ADMISSION as A } from "../../data/admission";

export default function Admission() {
  const navigate = useNavigate();
  return (
    <section className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        <div className="rounded-[24px] bg-[#f4f6f4] px-6 sm:px-12 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight leading-tight">
              {A.titleLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </h2>
            <p className="text-[12px] text-gray-500 leading-relaxed mt-4 max-w-sm">{A.desc}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <button onClick={() => navigate(A.ctaTo)} className="rounded-md bg-[#f2d90d] px-7 py-3 text-[13px] font-extrabold text-black hover:brightness-110 transition">
              {A.ctaText}
            </button>
            <a href={`tel:${A.phone.replace(/\s/g, "")}`} className="rounded-md bg-[#0a0f0d] text-white text-[12px] font-bold px-6 py-3 flex items-center gap-2 hover:bg-black transition">
              <span className="w-5 h-5 rounded-full bg-white/15 grid place-items-center text-[10px]">✆</span>
              {A.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
