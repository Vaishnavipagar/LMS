import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ── Layout (edit: src/components/layout/*.jsx + src/data/navigation.js, footer.js) ──
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ── Home sections, one dedicated file each ──
// Hero → components/home/Hero.jsx + data/hero.js
// Trusted-by → components/home/TrustedBy.jsx + data/organizations.js
// Benefits → components/home/Benefits.jsx + data/benefits.js
// Mission → components/home/Mission.jsx + data/mission.js
// Metrics → components/home/Metrics.jsx + data/metrics.js
// DeskBanner → components/home/DeskBanner.jsx (static)
import Hero from "./components/home/Hero";
import TrustedBy from "./components/home/TrustedBy";
import Benefits from "./components/home/Benefits";
import Mission from "./components/home/Mission";
import Metrics from "./components/home/Metrics";
import DeskBanner from "./components/home/DeskBanner";

// ── Pages (edit: src/pages/*.jsx + src/data/auth.js) ──
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";

// ── Admin panel (edit: src/admin/*) — separate app, same Supabase project ──
import AdminApp from "./admin/AdminApp";

import { scrollToId } from "./lib/scroll";

function HashScroll() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => scrollToId(hash.slice(1)), 80);
      return () => clearTimeout(t);
    }
    if (pathname !== "/" || !window.location.hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (pathname === "/" && window.location.hash) scrollToId(window.location.hash.slice(1));
  }, [pathname]);

  return null;
}

function HomePage() {
  return (
    <main className="w-full bg-[#F5F2EA]">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Benefits />
      <Mission />
      <Metrics />
      <DeskBanner />
      <Footer />
    </main>
  );
}

function SubPage({ children }) {
  return (
    <main className="w-full bg-[#F5F2EA] min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <>
      <HashScroll />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<SubPage><Courses /></SubPage>} />
        <Route path="/course/:courseId" element={<SubPage><CourseDetail /></SubPage>} />
        <Route path="/dashboard" element={<SubPage><Dashboard /></SubPage>} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}
