import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FOOTER as F } from "../../data/footer";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <footer className="bg-[#141414] text-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            {F.headingLines.map((l) => (
              <p key={l} className="font-extrabold text-[15px] leading-snug">{l}</p>
            ))}
            <button
              onClick={() => navigate("/login")}
              className="mt-5 rounded-full bg-[#F5820B] text-white text-[12px] font-bold px-6 py-2.5 hover:bg-[#E06F00] transition"
            >
              {F.ctaText}
            </button>
            <form onSubmit={subscribe} className="mt-5 flex items-center rounded-full bg-white/10 border border-white/10 pl-4 pr-1.5 py-1.5 max-w-[240px]">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="bg-transparent outline-none text-[12px] placeholder:text-white/40 flex-1 min-w-0"
              />
              <button className="w-7 h-7 shrink-0 rounded-full bg-[#F5820B] text-white grid place-items-center text-sm font-bold" aria-label="subscribe">
                →
              </button>
            </form>
            {done && <p className="text-[11px] text-green-300 font-semibold mt-2">Subscribed. Welcome aboard.</p>}
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">{F.infoTitle}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/65">
              {F.info.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">{F.contactTitle}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/65">
              <li>
                <a href={`mailto:${F.email}`} className="hover:text-white">{F.email}</a>
              </li>
              {F.address.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-5">
              {F.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-white/20 grid place-items-center text-[13px] text-white/70 hover:text-white hover:border-white/60 transition"
                >
                  {s.glyph}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-5 text-center">
          <p className="text-[11px] text-white/40">{F.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
