import { useState } from "react";
import { Link } from "react-router-dom";
import { FOOTER as F } from "../../data/footer";

export default function Footer() {
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
    <footer className="bg-[#0B0B0C] text-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-10">
          <div>
            <h2 className="text-[24px] sm:text-[28px] font-medium tracking-tight leading-[1.3] max-w-[320px]">
              {F.ctaTitle}
            </h2>
            <form onSubmit={subscribe} className="mt-6 flex items-center gap-2 max-w-[300px]">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={F.subscribePlaceholder}
                className="flex-1 min-w-0 rounded-full bg-transparent border border-white/20 outline-none text-[12px] placeholder:text-white/35 px-4 py-2.5 focus:border-white/50"
              />
              <button className="shrink-0 rounded-full bg-white text-black text-[12px] font-semibold px-5 py-2.5 hover:bg-neutral-200 transition">
                {F.subscribeButton}
              </button>
            </form>
            {done && <p className="text-[11px] text-[#cfe08a] font-semibold mt-2">{F.subscribedMessage}</p>}
          </div>

          {F.columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 text-[11px]">
          {F.meta.map((m) => (
            <div key={m.label}>
              <p className="font-semibold text-white/80">{m.label}</p>
              <p className="text-white/40 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <p className="text-[11px] text-white/40">{F.copyright}</p>
          <div className="flex items-center gap-4">
            {F.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-[12px] font-bold text-white/70 hover:text-white transition"
              >
                {s.glyph}
              </a>
            ))}
          </div>
        </div>

        <div aria-hidden className="overflow-hidden mt-6 select-none">
          <p className="font-extrabold tracking-[-0.05em] leading-[0.85] text-white text-[19vw] lg:text-[220px] whitespace-nowrap text-center">
            LearnLoop
          </p>
        </div>
      </div>
    </footer>
  );
}
