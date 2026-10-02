import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../data/navigation";
import { handleAnchorClick } from "../../lib/scroll";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (e, to) => {
    handleAnchorClick(e, to, navigate);
    setOpen(false);
  };

  return (
    <header className="static w-full bg-[#FFF8F0]">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-5">
        <button
          onClick={() => navigate("/")}
          className="text-[#111] font-semibold text-[20px] tracking-normal shrink-0"
        >
          LearnLoop
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                onClick={(e) => go(e, l.to)}
                className="text-[#444] hover:text-[#111] text-[14px] font-normal transition whitespace-nowrap"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-black text-[14px] font-medium hover:opacity-70 transition"
          >
            Signup
          </button>
          <button
            onClick={() => navigate("/login")}
            className="rounded-[6px] bg-[#F59300] text-white text-[13px] font-medium px-[18px] py-[10px] hover:bg-[#E08600] transition shadow-[0_2px_8px_rgba(245,147,0,0.25)]"
          >
            Start Learning Free →
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-[#111] text-2xl leading-none px-2" aria-label="menu">
          {open ? "×" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-4 mb-4 rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} onClick={(e) => go(e, l.to)} className="text-[#111] font-medium text-[15px]">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-2.5 mt-2">
              <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="w-full rounded-[6px] bg-[#F59300] text-white font-medium py-3 text-sm"
              >
                Start Learning Free →
              </button>
              <button onClick={() => { setOpen(false); navigate("/login"); }} className="w-full font-medium py-2 text-sm text-black">
                Signup
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
