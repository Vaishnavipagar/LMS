import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import YouTubeSection from "./components/YouTubeSection";
import CourseSection from "./components/CourseSection";
import WhyLinuxSection from "./components/WhyLinuxSection";
import StatsSection from "./components/StatsSection";
import TopFacultiesSection from "./components/TopFacultiesSection";
import BadgesSection from "./components/BadgesSection";
import BatchesSection from "./components/BatchesSection";
import ReviewSection from "./components/ReviewSection";
import BlogSection from "./components/BlogSection";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import Blogs from "./pages/Blogs";
import Videos from "./pages/Videos";
import About from "./pages/About";
import Profile from "./pages/Profile";

// Dashboard
import DashboardOS from "./dashboard/Dashboard";

/* ===============================
   SAFE SCROLL MANAGER
================================ */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = hash.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pathname, hash]);

  return null;
}

/* ===============================
   HOME PAGE
================================ */
function HomePage() {
  return (
    <>
      <div id="home"><HeroSection /></div>
      <div id="videos"><YouTubeSection /></div>
      <div id="courses"><CourseSection /></div>
      <div id="stats"><StatsSection /></div>
      <div id="reviews"><ReviewSection /></div>
      <div id="faculty"><TopFacultiesSection /></div>

      <WhyLinuxSection />
      <BadgesSection />
      <BatchesSection />
      <BlogSection />
    </>
  );
}

/* ===============================
   LANDING LAYOUT
================================ */
function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}

/* ===============================
   APP
================================ */
export default function App() {
  return (
    <>
      <ScrollToHash />

      <Routes>
        {/* Landing */}
        <Route
          path="/"
          element={
            <LandingLayout>
              <HomePage />
            </LandingLayout>
          }
        />

        <Route
          path="/login/*"
          element={
            <LandingLayout>
              <Login />
            </LandingLayout>
          }
        />

        <Route
          path="/signup/*"
          element={
            <LandingLayout>
              <Signup />
            </LandingLayout>
          }
        />

        <Route
          path="/courses"
          element={
            <LandingLayout>
              <Courses />
            </LandingLayout>
          }
        />

        <Route
          path="/blogs"
          element={
            <LandingLayout>
              <Blogs />
            </LandingLayout>
          }
        />

        <Route
          path="/videos"
          element={
            <LandingLayout>
              <Videos />
            </LandingLayout>
          }
        />

        <Route
          path="/about"
          element={
            <LandingLayout>
              <About />
            </LandingLayout>
          }
        />

        {/* ✅ DASHBOARD (FIXED) */}
        <Route
          path="/dashboard/*"
          element={
            <>
              <SignedIn>
                <DashboardOS />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <SignedIn>
                <LandingLayout>
                  <Profile />
                </LandingLayout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </>
  );
}