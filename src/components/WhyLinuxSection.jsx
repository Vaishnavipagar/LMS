import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FaShieldAlt,
  FaRocket,
  FaServer,
  FaCode,
  FaCogs,
  FaInfinity,
} from "react-icons/fa";

/* ===============================
   Data & Configuration
================================ */
const initialFeatures = [
  {
    icon: <FaShieldAlt />,
    title: "Secure by Design",
    desc: "Linux is built with a strong permission and security model trusted by enterprises and servers worldwide.",
    colorClass: "text-emerald-500 bg-emerald-50",
    borderClass: "border-slate-600",
    shadowClass: "shadow-emerald-500/20",
  },
  {
    icon: <FaRocket />,
    title: "High Performance",
    desc: "Lightweight, fast, and optimized for servers, containers, and cloud workloads.",
    colorClass: "text-blue-500 bg-blue-50",
    borderClass: "border-slate-800",
    shadowClass: "shadow-blue-500/20",
  },
  {
    icon: <FaServer />,
    title: "Industry Standard",
    desc: "Linux powers 90% of servers, cloud infrastructure, and DevOps pipelines.",
    colorClass: "text-violet-500 bg-violet-50",
    borderClass: "border-slate-600",
    shadowClass: "shadow-violet-500/20",
  },
  {
    icon: <FaCode />,
    title: "Developer Friendly",
    desc: "Powerful CLI tools, package managers, scripting, and full control over your system.",
    colorClass: "text-orange-500 bg-orange-50",
    borderClass: "border-slate-600",
    shadowClass: "shadow-orange-500/20",
  },
  {
    icon: <FaCogs />,
    title: "Highly Customizable",
    desc: "From kernel to UI, Linux can be customized for any workflow or system.",
    colorClass: "text-cyan-500 bg-cyan-50",
    borderClass: "border-slate-600",
    shadowClass: "shadow-cyan-500/20",
  },
  {
    icon: <FaInfinity />,
    title: "Open Source Freedom",
    desc: "Free, transparent, and backed by one of the largest open-source communities in the world.",
    colorClass: "text-rose-500 bg-rose-50",
    borderClass: "border-slate-600",
    shadowClass: "shadow-rose-500/20",
  }
];

/* ===============================
   Variants
================================ */
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
};

const leftVariants = {
  hidden: { opacity: 0, x: -50, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* 🔥 Card Stack Animation Logic */
const cardVariants = (index, reduced) => ({
  hidden: {
    opacity: 0,
    y: reduced ? 0 : 40,
    scale: 0.95,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: index * 18, // Tighter stacking
    scale: 1 - index * 0.04,
    rotateX: 0,
    zIndex: 10 - index,
    transition: {
      duration: reduced ? 0 : 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -50,
    transition: { duration: 0.2 },
  },
});

/* ===============================
   Component
================================ */
export default function WhyLinuxSection() {
  const [cards, setCards] = useState(initialFeatures);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const intervalRef = useRef(null);

  /* ===============================
     Auto Rotate Logic
  ================================ */
  useEffect(() => {
    if (!paused && !prefersReducedMotion) {
      intervalRef.current = setInterval(() => {
        setCards((prev) => {
          const updated = [...prev];
          updated.push(updated.shift());
          return updated;
        });
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, prefersReducedMotion]);

  /* ===============================
     Swipe/Drag Logic
  ================================ */
  const swipeThreshold = typeof window !== "undefined" && window.innerWidth < 768 ? 60 : 100;

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > swipeThreshold) {
      setCards((prev) => [...prev.slice(1), prev[0]]);
    }
  };

  return (
    <motion.section
      className="relative py-32 px-6 bg-white overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3, once: true }}
      style={{
        backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 px-4 md:px-8">
        
        {/* ================= LEFT CONTENT ================= */}
        <motion.div className="max-w-xl" variants={leftVariants}>
          <motion.div 
            className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 mb-6"
            variants={textVariants}
          >
            The Operating System of the Web
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]"
            variants={textVariants}
          >
            Why <br />
            <span className="text-gray-500">
              Linux Matters?
            </span>
          </motion.h2>

          <motion.p 
            className="text-xl text-slate-600 leading-relaxed mb-8 font-medium"
            variants={textVariants}
          >
            It's not just an OS. It's the foundation of the internet, cloud computing, and modern DevOps.
          </motion.p>

          <motion.div variants={textVariants} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl">
                <FaServer />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">90% of Public Cloud</h4>
                <p className="text-sm text-slate-500">Runs on Linux workloads</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                <FaRocket />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">100% of Supercomputers</h4>
                <p className="text-sm text-slate-500">Powered by Linux kernels</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ================= RIGHT CONTENT (GLASS CARD STACK) ================= */}
        <div
          className="relative h-[500px] w-full flex justify-center lg:justify-end items-center perspective-1000"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="popLayout">
            {cards.slice(0, 4).map((card, index) => (
              <motion.div
                key={card.title}
                className={`
                  absolute w-full max-w-[460px] p-8 md:p-10
                  rounded-[32px] 
                  bg-white/95 backdrop-blur-xl
                  border-l-[6px] ${card.borderClass} border-y border-r border-slate-100
                  shadow-2xl shadow-slate-200/60
                  cursor-grab active:cursor-grabbing
                  flex flex-col gap-6
                `}
                
                // Drag Logic
                drag={index === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                
                // Animation
                variants={cardVariants(index, prefersReducedMotion)}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-5">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-3xl 
                    ${card.colorClass} shadow-lg ${card.shadowClass}
                    transition-transform duration-300 group-hover:scale-110
                  `}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-100" />
                
                {/* Description */}
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  {card.desc}
                </p>

                {/* Swipe Indicator */}
                {index === 0 && (
                   <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>Drag</span>
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                   </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}