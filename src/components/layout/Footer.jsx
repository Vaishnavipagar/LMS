import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FOOTER as F } from "../../data/footer";
import { FOOTER_BOTTOM_LINKS } from "../../data/navigation";
import { handleAnchorClick } from "../../lib/scroll";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  const go = (e, to) => handleAnchorClick(e, to, navigate);

  return (
    <footer className="bg-[#0a0f0d] text-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-extrabold">{F.brand}</p>
            <p className="text-[11px] text-white/50 leading-relaxed mt-3 max-w-[220px]">{F.tagline}</p>
            <form onSubmit={subscribe} className="mt-5 flex items-center rounded-full bg-white/10 border border-white/10 pl-4 pr-1.5 py-1.5 max-w-[240px]">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="bg-transparent outline-none text-[12px] placeholder:text-white/40 flex-1 min-w-0"
              />
              <button className="w-7 h-7 shrink-0 rounded-full bg-[#f2d90d] text-black grid place-items-center text-sm font-bold" aria-label="subscribe">
                →
              </button>
            </form>
            {done && <p className="text-[11px] text-[#7ee2a8] font-semibold mt-2">Subscribed. Welcome aboard.</p>}
          </div>

          <div>
            <p className="text-[13px] font-bold">{F.popularTitle}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
              {F.popular.map((c) => (
                <li key={c}><Link to="/courses" className="hover:text-white">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-bold">{F.supportTitle}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
              {F.support.map((c) => (
                <li key={c}><Link to="/login" className="hover:text-white cursor-pointer">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-bold">{F.helpTitle}</p>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
              {F.help.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/60 font-medium">
            {FOOTER_BOTTOM_LINKS.map((l) => (
              <Link key={l.label} to={l.to} onClick={(e) => go(e, l.to)} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-white/35">© {new Date().getFullYear()} LearnAxis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
