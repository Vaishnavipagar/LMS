import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { adminSignOut } from "../lib/adminApi";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/batches", label: "Batches" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/instructors", label: "Instructors" },
  { to: "/admin/enrollments", label: "Enrollments" },
  { to: "/admin/payments", label: "Purchases" },
  { to: "/admin/badges", label: "Badges" },
  { to: "/admin/certificates", label: "Certificates" },
];

export default function AdminLayout({ userEmail, children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await adminSignOut();
    navigate("/admin/login", { replace: true });
  };

  const linkCls = ({ isActive }) =>
    `px-4 py-2.5 rounded-xl text-[13px] font-bold transition whitespace-nowrap ${
      isActive ? "bg-white text-[#191817]" : "text-white/70 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#191817] flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 shrink-0 bg-[#191817] text-white flex-col p-5 sticky top-0 h-screen">
        <Link to="/admin" className="font-extrabold text-lg tracking-tight px-2">
          LearnLoop <span className="text-[#F5820B]">Admin</span>
        </Link>
        <p className="text-[11px] text-white/40 px-2 mt-1 mb-6 truncate">{userEmail}</p>
        <nav className="flex flex-col gap-1.5">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <Link to="/" className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white/70 hover:text-white hover:bg-white/10 transition">
            ← View website
          </Link>
          <button onClick={logout} className="text-left px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-300 hover:bg-red-500/20 transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <div className="md:hidden bg-[#191817] text-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/admin" className="font-extrabold tracking-tight">
            LearnLoop <span className="text-[#F5820B]">Admin</span>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl px-2" aria-label="menu">
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <nav className="px-4 pb-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/" className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white/70">
              ← View website
            </Link>
            <button onClick={logout} className="text-left px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-300">
              Logout
            </button>
          </nav>
        )}
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
