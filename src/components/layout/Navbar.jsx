import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../data/navigation";
import { handleAnchorClick } from "../../lib/scroll";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logged = typeof window !== "undefined" && !!localStorage.getItem("learnaxis_user");

  const go = (e, to) => {
    if (handleAnchorClick(e, to, navigate)) setOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 pt-6">
        <button onClick={() => navigate("/")} className="text-white font-extrabold text-lg tracking-tight">
          LearnAxis
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link to={l.to} onClick={(e) => go(e, l.to)} className="text-white/85 hover:text-white text-[13px] font-medium transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          {logged ? (
            <button
              onClick={() => navigate("/courses")}
              className="text-[13px] font-semibold text-white border border-white/40 rounded-full px-5 py-2 hover:bg-white hover:text-[#0a4a3c] transition"
            >
              Dashboard
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="text-[13px] font-semibold text-white/90 hover:text-white transition">
              Contact us
            </button>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-2xl leading-none px-2" aria-label="menu">
          {open ? "×" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-4 mt-3 rounded-2xl bg-[#08382d] border border-white/15 p-5 shadow-2xl">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} onClick={(e) => go(e, l.to)} className="text-white font-semibold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="w-full mt-2 rounded-full bg-[#f2d90d] text-black font-bold py-3 text-sm"
              >
                Contact us / Login
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
