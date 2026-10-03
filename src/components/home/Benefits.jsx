import { useNavigate } from "react-router-dom";
import { BENEFITS as B } from "../../data/benefits";
import SmartImg from "../../lib/SmartImg";

export default function Benefits() {
  const navigate = useNavigate();
  const rows = B.cards.slice(0, 2);

  return (
    <section id="benefits" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 space-y-14">
        {rows.map((c, i) => (
          <div key={c.title} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className={i % 2 === 1 ? "order-1 md:order-2" : "order-1"}>
              <SmartImg
                local={c.local}
                remote={c.remote}
                alt={c.imgAlt}
                className="block w-full h-[280px] sm:h-[340px] object-cover rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              />
            </div>
            <div className={i % 2 === 1 ? "order-2 md:order-1" : "order-2"}>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#111]/45">
                {c.label}
              </p>
              <h3 className="text-[26px] sm:text-[30px] font-medium tracking-tight text-[#111] mt-3 leading-[1.2]">
                {c.title}
              </h3>
              <p className="text-[13px] text-[#555] leading-relaxed mt-4 max-w-[420px]">
                {c.text}
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="mt-6 rounded-full bg-black text-white text-[13px] font-medium px-6 py-3 hover:bg-neutral-800 transition"
              >
                Join the waitlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
