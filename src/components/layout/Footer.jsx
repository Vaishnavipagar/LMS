import { useNavigate } from "react-router-dom";
import { FOOTER as F } from "../../data/footer";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#232323] text-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-[12px] text-white/50">{F.headingSmall}</p>
            <p className="text-[14px] font-medium text-white mt-1.5 leading-snug max-w-[240px]">
              {F.headingMain}
            </p>
            <button
              onClick={() => navigate(F.ctaTo)}
              className="mt-5 rounded-[6px] bg-[#F59300] text-white text-[12px] font-bold px-5 py-2.5 hover:bg-[#E08600] transition"
            >
              {F.ctaText}
            </button>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
              {F.infoTitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/65">
              {F.info.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
              {F.contactTitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/65">
              <li>
                <a href={`mailto:${F.email}`} className="hover:text-white">
                  {F.email}
                </a>
              </li>
              {F.address.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
          <p className="text-[11px] text-white/40">{F.copyright}</p>
          <div className="flex items-center gap-4">
            {F.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-[13px] font-bold text-white hover:opacity-70 transition"
              >
                {s.glyph}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
