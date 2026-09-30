import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleAnchorClick } from "../../lib/scroll";

// Labels match the reference design; each points at the closest existing
// section/route so every link keeps working with current routes.
const NAV_ITEMS = [
  { label: "Home", to: "/#home" },
  { label: "Courses", to: "/#courses" },
  { label: "Paths", to: "/courses" },
  { label: "Mentors", to: "/#instructors" },
  { label: "Reviews", to: "/#testimonial" },
  { label: "Why Us", to: "/#instructors" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (e, to) => {
    handleAnchorClick(e, to, navigate);
    setOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="flex justify-center px-4 pt-4">
        <nav className="flex items-center justify-between w-full max-w-6xl bg-white rounded-full border border-slate-200/70 pl-7 pr-2.5 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
          <button onClick={() => navigate("/")} className="text-slate-900 font-extrabold text-[17px] tracking-tight shrink-0">
            LearnAxis
          </button>

          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_ITEMS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={(e) => go(e, l.to)}
                  className="text-slate-600 hover:text-slate-950 font-semibold text-sm transition whitespace-nowrap"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <span className="w-px h-8 bg-slate-200" aria-hidden />
            <button
              onClick={() => navigate("/login")}
              className="bg-slate-950 text-white font-bold text-sm px-7 py-3 rounded-full hover:bg-slate-800 transition"
            >
              Login
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-slate-900 text-2xl leading-none px-3 py-1" aria-label="menu">
            {open ? "×" : "☰"}
          </button>
        </nav>
      </div>

      {open && (
        <div className="md:hidden mx-4 mt-2 rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} onClick={(e) => go(e, l.to)} className="text-slate-700 font-semibold text-[15px] hover:text-slate-950">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="w-full mt-2 rounded-full bg-slate-950 text-white font-bold py-3 text-sm hover:bg-slate-800 transition"
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
