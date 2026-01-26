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
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

/* ===============================
   SAFE SCROLL MANAGER
   (Makes navbar links work without crashing login)
================================ */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. If no hash (e.g., just clicking "Home"), scroll to top
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2. SAFETY CHECK: Ignore Clerk's internal URLs (Prevent Login Crash)
    if (hash.includes("sso") || hash.includes("verify") || hash.includes("/")) {
      return;
    }

    // 3. Find the element and scroll to it
    // We use getElementById because it is "Crash-Proof"
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
      {/* IMPORTANT: Ensure your components have these IDs inside them! 
         Example: <section id="videos"> ... </section>
      */}
      <div id="home"><HeroSection /></div>
      <div id="videos"><YouTubeSection /></div>
      <div id="courses"><CourseSection /></div>
      <div id="stats"><StatsSection /></div>
      <div id="reviews"><ReviewSection /></div>
      <div id="faculty"><TopFacultiesSection /></div>
      
      {/* Other sections that don't need direct links */}
      <WhyLinuxSection />
      <BadgesSection />
      <BatchesSection />
      <BlogSection />
    </>
  );
}

/* ===============================
   APP
================================ */
export default function App() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden min-h-screen">
        <ScrollToHash /> {/* 👈 Active and Safe */}
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Wildcards (*) ensure Login/Signup flows don't break */}
          <Route path="/login/*" element={<Login />} />
          <Route path="/signup/*" element={<Signup />} />

          <Route path="/courses" element={<Courses />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
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
                  <Profile />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}