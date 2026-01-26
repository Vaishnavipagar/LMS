import React, { useState, useRef } from "react";

/* ===============================
   Course Data
================================ */
const courses = [
  {
    title: "Linux Fundamentals",
    category: "Linux",
    level: "Beginner",
    desc: "Master Linux command line, filesystem, permissions, and shell scripting.",
    price: "Free",
    image: "https://t3.ftcdn.net/jpg/06/07/04/30/360_F_607043015_0F4e0j0Q4e0j0Q4e0j0Q4e0j0Q4e0j0.jpg", 
    colorClass: "bg-green-100 text-green-700 border-green-200",
  },
  {
    title: "React for Developers",
    category: "Frontend",
    level: "Intermediate",
    desc: "Build modern React apps with hooks, router, and performance patterns.",
    price: "₹999",
    image: "https://cdn.pixabay.com/photo/2023/10/30/05/18/react-8352178_1280.png",
    colorClass: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    title: "DevOps with Docker",
    category: "DevOps",
    level: "Intermediate",
    desc: "Containerization, Docker images, volumes, and production workflows.",
    price: "₹1299",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3bAlqaZZhiu-tYtF5Xg7Qh6_j6e9r4e6j4g&s",
    colorClass: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    title: "Kubernetes Mastery",
    category: "DevOps",
    level: "Advanced",
    desc: "Deploy, scale, and manage containers in real production environments.",
    price: "₹1999",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*d69DKz3f_9s8J0j1s9y9gA.png",
    colorClass: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    title: "System Design 101",
    category: "Architecture",
    level: "Advanced",
    desc: "Learn to design scalable systems like Netflix, Uber, and Twitter.",
    price: "₹2499",
    image: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20220224155110/System-Design-Tutorial-1.png",
    colorClass: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
];

export default function CourseSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const currentScroll = scrollRef.current.scrollLeft;
    // Calculate progress: 0 to 1 based on 400px scroll
    const progress = Math.min(currentScroll / 400, 1);
    setScrollProgress(progress);
  };

  return (
    <section 
      className="py-20 bg-white relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      {/* NUCLEAR CSS INJECTION: 
         This style block forces the scrollbar to be hidden with !important 
      */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none !important;
        }
        .scrollbar-hide {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
        }
      `}</style>
      
      {/* CENTRED TITLE */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Explore Courses
        </h2>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto h-auto lg:h-[520px] flex flex-col lg:block gap-10">
        
        {/* ================= LAYER 1: TEXT (Background) ================= */}
        <div 
          className="relative lg:absolute lg:top-1/2 lg:-translate-y-1/2 left-0 lg:left-[60px] w-full lg:w-[420px] z-[1] text-center lg:text-left px-6 lg:px-0 transition-all duration-100 ease-linear will-change-transform"
          style={{
            ...(window.innerWidth >= 1024 ? {
              opacity: 1 - scrollProgress,
              filter: `blur(${scrollProgress * 20}px)`,
              transform: `translateY(-50%) scale(${1 - scrollProgress * 0.1})`,
            } : {})
          }}
        >
          <div className="mb-8">
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-5">
              Master <br />
              <span className="text-gray-500">
                Industry Skills
              </span>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              From Linux to DevOps, Frontend to System Design — get hands-on experience 
              with our project-based curriculum.
            </p>
            
            <button className="px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold transition-all duration-300 hover:bg-slate-800 hover:scale-105 hover:shadow-xl hover:shadow-slate-300">
              View All Courses →
            </button>
          </div>
        </div>

        {/* ================= LAYER 2: SCROLLER (Foreground) ================= */}
        <div 
          // ✨ KEY FIX: Added 'scrollbar-hide' class AND Tailwind arbitrary variants
          className="scrollbar-hide relative lg:absolute inset-0 z-10 overflow-x-auto flex items-center [&::-webkit-scrollbar]:hidden"
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            // Inline fallback for Firefox
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
          }}
        >
          <div className="flex items-center gap-8 h-full pl-6 lg:pl-0 pr-6 lg:pr-[60px]">
            
            {/* 👻 INVISIBLE SPACER (Desktop Only) */}
            <div className="hidden lg:block flex-shrink-0 w-[500px] h-full pointer-events-none"></div>

            {/* COURSE CARDS */}
            {courses.map((course, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[340px] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300 hover:border-indigo-200"
              >
                {/* Image Header */}
                <div className="relative h-[180px] w-full">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {course.level}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide border ${course.colorClass}`}>
                      {course.category}
                    </span>
                    <span className="font-bold text-slate-900 text-lg">{course.price}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                    {course.desc}
                  </p>

                  <button className="w-full py-3 rounded-xl font-semibold bg-slate-900 text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-lg">
  View Details
</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}