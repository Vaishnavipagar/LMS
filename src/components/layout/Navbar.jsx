import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../data/navigation";
import { handleAnchorClick } from "../../lib/scroll";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, to) => {
    handleAnchorClick(e, to, navigate);
    setOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-300 ${
          scrolled ? "bg-[#0B2417]/92 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : "bg-transparent"
        }`}
      >
        <nav className="relative w-full max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-5">
          <button
            onClick={() => navigate("/")}
            className="text-white font-semibold text-[20px] tracking-tight shrink-0 flex items-center gap-2"
          >
            <span className="w-6 h-6 rounded-full border-2 border-white/80 grid place-items-center text-[11px]">
              ◐
            </span>
            LearnLoop
          </button>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={(e) => go(e, l.to)}
                  className="text-white/70 hover:text-white text-[14px] font-normal transition whitespace-nowrap"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <span className="text-white/50 text-[12px] font-medium whitespace-nowrap">
              Promo 20%
            </span>
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-black text-white text-[13px] font-medium px-[20px] py-[10px] hover:bg-neutral-800 transition shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            >
              Get Started
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-white text-2xl leading-none px-2" aria-label="menu">
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
