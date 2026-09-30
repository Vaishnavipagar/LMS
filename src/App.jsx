import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ── Layout (edit: src/components/layout/*.jsx + src/data/navigation.js, footer.js) ──
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ── Home sections, one dedicated file each ──
// Hero → components/home/Hero.jsx + data/hero.js
// Brands → components/home/LogoStrip.jsx + data/brands.js
// Journey → components/home/Journey.jsx + data/journey.js
// Courses → components/home/PopularCourses.jsx + data/courses.*.js
// Premium → components/home/PremiumExperience.jsx + data/premium.js
// Watermark → components/home/Watermark.jsx (static)
// Testimonials → components/home/Testimonials.jsx + data/testimonials.js
// Articles → components/home/Articles.jsx + data/articles.js
// Admission → components/home/Admission.jsx + data/admission.js
import Hero from "./components/home/Hero";
import LogoStrip from "./components/home/LogoStrip";
import Journey from "./components/home/Journey";
import PopularCourses from "./components/home/PopularCourses";
import PremiumExperience from "./components/home/PremiumExperience";
import Watermark from "./components/home/Watermark";
import Testimonials from "./components/home/Testimonials";
import Articles from "./components/home/Articles";
import Admission from "./components/home/Admission";

// ── Pages (edit: src/pages/*.jsx + src/data/auth.js) ──
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

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
    <main className="w-full bg-white">
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <LogoStrip />
      <Journey />
      <PopularCourses />
      <PremiumExperience />
      <Watermark />
      <Testimonials />
      <Articles />
      <Admission />
      <Footer />
    </main>
  );
}

function SubPage({ children, darkNav = false }) {
  return (
    <main className="w-full bg-white min-h-screen">
      <div className={`relative ${darkNav ? "bg-[#0a4a3c]" : ""}`}>
        <Navbar />
        {children}
      </div>
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
        <Route path="/courses" element={<SubPage darkNav><Courses /></SubPage>} />
        <Route path="/course/:courseId" element={<SubPage darkNav><CourseDetail /></SubPage>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}
