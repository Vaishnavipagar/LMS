import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ======================
   REVIEWS DATA
====================== */
const reviews = [
  {
    name: "James Carter",
    role: "HR Manager at BrightPath Solutions",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "The platform is easy to use, keeps everything in one place, and helps our team stay on top of things without extra hassle.",
  },
  {
    name: "Sarah Mitchell",
    role: "HR Director at Nexa Solutions",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    text: "CoreShift has streamlined our HR processes, making tasks like onboarding and performance tracking more efficient. It helps us stay organized and saves our team time.",
  },
  {
    name: "Aman Sharma",
    role: "DevOps Engineer",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    text: "Hands down the best platform to learn Linux and DevOps. The projects and explanations are top notch.",
  },
];

export default function ReviewSection() {
  const [index, setIndex] = useState(0);

  /* ======================
     AUTO PLAY
  ====================== */
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  };

  const next = () => {
    setIndex((i) => (i + 1) % reviews.length);
  };

  const current = reviews[index];
  const prevCard = reviews[(index - 1 + reviews.length) % reviews.length];
  const nextCard = reviews[(index + 1) % reviews.length];

  return (
    <section
      id="reviews"
      // Added bg-white, relative positioning, and overflow handling
      className="py-16 sm:py-24 md:py-[140px] flex flex-col items-center justify-center px-4 sm:px-6 bg-white relative overflow-hidden"
      // Added the consistent light gray dot pattern
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      {/* ================= TITLE ================= */}
      <h2 className="text-2xl sm:text-3xl md:text-[48px] font-black mb-2 text-slate-900 text-center relative z-10 px-4">
        Words of Appreciation
      </h2>
      <p className="text-slate-500 mb-8 sm:mb-[60px] text-center max-w-[600px] relative z-10 px-4 text-sm sm:text-base">
        Thousands of businesses, from startups to enterprises, use our platform.
      </p>

      {/* ================= CARD STAGE ================= */}
      <div className="relative w-[320px] sm:w-[380px] md:w-[420px] h-[380px] sm:h-[400px] md:h-[420px] flex items-center justify-center z-10">
        {/* ================= SPREAD STACK ================= */}
        <div className="absolute w-full h-full flex items-center justify-center">
          {/* LEFT CARD */}
          <motion.div
            key={prevCard.name}
            initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: -12, x: -100, scale: 0.95 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            className="absolute w-[260px] sm:w-[300px] md:w-[340px] h-[320px] sm:h-[340px] md:h-[360px] bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 z-10 hidden sm:block"
          />

          {/* RIGHT CARD */}
          <motion.div
            key={nextCard.name}
            initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: 12, x: 100, scale: 0.95 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            className="absolute w-[260px] sm:w-[300px] md:w-[340px] h-[320px] sm:h-[340px] md:h-[360px] bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 z-10 hidden sm:block"
          />

          {/* ================= MAIN CARD ================= */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ y: 120, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 120, opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
              className="
                absolute z-30
                w-[290px] sm:w-[320px] md:w-[360px] h-[350px] sm:h-[370px] md:h-[380px]
                bg-white
                rounded-2xl
                border border-slate-200
                shadow-[0_40px_100px_rgba(0,0,0,0.12)]
                p-5 sm:p-6 md:p-8
                flex flex-col items-center text-center justify-between
              "
            >
              <div>
                <img
                  src={current.avatar}
                  className="w-16 h-16 rounded-xl object-cover mx-auto mb-4 border border-slate-100"
                  alt={current.name}
                />

                <h3 className="font-bold text-lg text-slate-900">
                  {current.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {current.role}
                </p>

                {/* Stars */}
                <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <span className="text-slate-700 ml-2 text-sm font-semibold">
                    {current.rating}.0
                  </span>
                </div>

                <p className="text-slate-600 text-[15px] leading-[1.7]">
                  “{current.text}”
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="flex gap-4 mt-10 relative z-10">
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition shadow-sm"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={next}
          className="w-12 h-12 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition shadow-sm"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}