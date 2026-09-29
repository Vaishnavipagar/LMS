import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";

// Shell
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Home sections — one file per section
import HeroSection from "./components/HeroSection";
import TrustBar from "./components/TrustBar";
import CourseSection from "./components/CourseSection";
import LearningPaths from "./components/LearningPaths";
import WhyLinuxSection from "./components/WhyLinuxSection";
import StatsSection from "./components/StatsSection";
import TopFacultiesSection from "./components/TopFacultiesSection";
import ReviewSection from "./components/ReviewSection";
import CTASection from "./components/CTASection";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
import CoursePlayer from "./pages/course/CoursePlayer";

// Dashboards
import DashboardOS from "./dashboard/Dashboard";
import AdminApp from "./apps/admin/AdminApp";
import { checkAdmin } from "./services/admin/authService";

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => clearTimeout(t);
  }, [hash, pathname]);

  return null;
}

function HomePage() {
  return (
    <>
      <div id="home"><HeroSection /></div>
      <TrustBar />
      <div id="courses"><CourseSection preview /></div>
      <LearningPaths />
      <div id="why"><WhyLinuxSection /></div>
      <div id="stats"><StatsSection /></div>
      <TopFacultiesSection />
      <ReviewSection />
      <CTASection />
    </>
  );
}

function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}

function AdminRoute() {
  const { user, isLoaded } = useUser();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user?.id) return;
    checkAdmin(user.id)
      .then((r) => setAllowed(r.isAdmin === true))
      .catch(() => setAllowed(false))
      .finally(() => setChecking(false));
  }, [isLoaded, user]);

  if (!isLoaded || checking) return <div className="p-10 pt-28">Checking admin access...</div>;
  if (!allowed) return <div className="p-10 pt-28 text-red-500 font-semibold">You are not authorized as Admin</div>;
  return <AdminApp />;
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<LandingLayout><HomePage /></LandingLayout>} />
        <Route path="/login/*" element={<LandingLayout><Login /></LandingLayout>} />
        <Route path="/signup/*" element={<LandingLayout><Signup /></LandingLayout>} />
        <Route path="/courses" element={<LandingLayout><Courses /></LandingLayout>} />
        <Route
          path="/dashboard/*"
          element={<><SignedIn><DashboardOS /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>}
        />
        <Route
          path="/admin/*"
          element={<><SignedIn><AdminRoute /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>}
        />
        <Route
          path="/profile"
          element={<><SignedIn><LandingLayout><Profile /></LandingLayout></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>}
        />
        <Route path="/course/:courseId" element={<CoursePlayer />} />
        <Route path="*" element={<LandingLayout><HomePage /></LandingLayout>} />
      </Routes>
    </>
  );
}
