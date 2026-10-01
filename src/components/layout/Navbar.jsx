import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../data/navigation";
import { handleAnchorClick } from "../../lib/scroll";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logged = typeof window !== "undefined" && !!localStorage.getItem("learnaxis_user");

  const go = (e, to) => {
    handleAnchorClick(e, to, navigate);
    setOpen(false);
  };

  return (
    <header className="static w-full bg-[#F6F0E6]">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-5">
        <button onClick={() => navigate("/")} className="text-[#191817] font-extrabold text-[17px] tracking-tight shrink-0">
          LearnLoop
        </button>

        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                onClick={(e) => go(e, l.to)}
                className="text-[#191817]/70 hover:text-[#191817] text-[13px] font-medium transition whitespace-nowrap"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          {logged ? (
            <button
              onClick={() => navigate("/courses")}
              className="rounded-full bg-[#191817] text-white text-[13px] font-bold px-6 py-2.5 hover:bg-black transition"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-[#191817]/70 hover:text-[#191817] text-[13px] font-medium transition">
                Signup
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-[#F5820B] text-white text-[13px] font-bold px-6 py-2.5 hover:bg-[#E06F00] transition shadow-[0_8px_20px_rgba(245,130,11,0.35)]"
              >
                Start Learning free
              </button>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-[#191817] text-2xl leading-none px-2" aria-label="menu">
          {open ? "×" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-4 mb-4 rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} onClick={(e) => go(e, l.to)} className="text-[#191817] font-semibold text-[15px]">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-2.5 mt-2">
              <button
                onClick={() => { setOpen(false); navigate(logged ? "/courses" : "/login"); }}
                className="w-full rounded-full bg-[#F5820B] text-white font-bold py-3 text-sm"
              >
                {logged ? "Dashboard" : "Start Learning free"}
              </button>
              {!logged && (
                <button onClick={() => { setOpen(false); navigate("/login"); }} className="w-full font-semibold py-2 text-sm text-[#191817]/70">
                  Signup
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
