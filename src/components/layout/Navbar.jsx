import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../data/navigation";
import { handleAnchorClick } from "../../lib/scroll";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [promoLeft, setPromoLeft] = useState(12 * 60 + 7);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      // Dark theme only while the dark hero is still under the navbar;
      // everywhere else (white sections) switch to dark text on white.
      const hero = document.getElementById("home");
      setOnDark(!!hero && hero.getBoundingClientRect().bottom > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = setInterval(() => {
      setPromoLeft((s) => (s <= 0 ? 12 * 60 + 7 : s - 1));
    }, 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(timer);
    };
  }, []);

  const promoTime = [Math.floor(promoLeft / 3600)]
    .concat([Math.floor((promoLeft % 3600) / 60), promoLeft % 60])
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

  const go = (e, to) => {
    handleAnchorClick(e, to, navigate);
    setOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-300 ${
          onDark
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md border-b border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        }`}
      >
        <nav className="relative w-full flex items-center px-5 sm:px-8 py-5">
          <button
            onClick={() => navigate("/")}
            className={`font-semibold text-[20px] tracking-tight shrink-0 flex items-center gap-2 transition-colors duration-300 ${
              onDark ? "text-white" : "text-[#111]"
            }`}
          >
            <span className={`w-6 h-6 rounded-full border-2 grid place-items-center text-[11px] transition-colors duration-300 ${onDark ? "border-white/80" : "border-[#111]/80"}`}>
              ◐
            </span>
            LearnLoop
          </button>

          <ul className="hidden md:flex items-center gap-8 ml-10 lg:ml-20">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={(e) => go(e, l.to)}
                  className={`text-[14px] font-normal transition whitespace-nowrap duration-300 ${
                    onDark ? "text-white/70 hover:text-white" : "text-[#444] hover:text-black"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3 ml-auto rounded-full bg-black/30 backdrop-blur-md border border-white/10 pl-2 pr-2 py-1.5">
            <span className="w-8 h-8 shrink-0 rounded-full bg-white/15 grid place-items-center text-white text-[13px]">
              ✳
            </span>
            <span className="leading-tight">
              <span className="block text-white text-[13px] font-semibold whitespace-nowrap">Promo 20%</span>
              <span className="block text-white/60 text-[10px] tabular-nums">{promoTime}</span>
            </span>
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-black text-white text-[13px] font-medium px-[20px] py-[10px] hover:bg-neutral-800 transition shadow-[0_4px_16px_rgba(0,0,0,0.4)] whitespace-nowrap"
            >
              Get Started
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className={`md:hidden ml-auto text-2xl leading-none px-2 transition-colors duration-300 ${onDark ? "text-white" : "text-[#111]"}`} aria-label="menu">
            {open ? "×" : "☰"}
          </button>
        </nav>

        {open && (
          <div className="md:hidden absolute top-full left-4 right-4 z-[110] rounded-2xl bg-[#0E2A1B] border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} onClick={(e) => go(e, l.to)} className="text-white font-medium text-[15px]">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="flex flex-col gap-2.5 mt-2">
                <button
                  onClick={() => { setOpen(false); navigate("/login"); }}
                  className="w-full rounded-full bg-white text-black font-medium py-3 text-sm"
                >
                  Get Started
                </button>
                <button onClick={() => { setOpen(false); navigate("/login"); }} className="w-full font-medium py-2 text-sm text-white/80">
                  Signup
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
      {/* In-flow spacer matching the navbar height so fixed positioning
          never makes page content jump or slide underneath. */}
      <div aria-hidden className="w-full h-[72px] bg-[#0B2417]" />
    </>
  );
}
