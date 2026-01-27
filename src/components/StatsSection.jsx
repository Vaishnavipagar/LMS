import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { 
  FiUsers, FiBook, FiAward, FiActivity, FiUserCheck, FiBriefcase 
} from "react-icons/fi";

/* ===============================
   STATS DATA
================================ */
const stats = [
  { 
    id: 1,
    title: "Active Learners", 
    value: 12480, 
    suffix: "+", 
    desc: "Join thousands of developers leveling up their careers.", 
    icon: <FiUsers className="text-2xl" />,
    color: "bg-blue-50 text-blue-600"
  },
  { 
    id: 2,
    title: "Courses Available", 
    value: 120, 
    suffix: "+", 
    desc: "From Linux basics to advanced Kubernetes architecture.", 
    icon: <FiBook className="text-2xl" />,
    color: "bg-amber-50 text-amber-600"
  },
  { 
    id: 3,
    title: "Certificates Issued", 
    value: 8300, 
    suffix: "+", 
    desc: "Industry-recognized credentials for your resume.", 
    icon: <FiAward className="text-2xl" />,
    color: "bg-purple-50 text-purple-600"
  },
  { 
    id: 4,
    title: "System Uptime", 
    value: 99.9, 
    suffix: "%", 
    desc: "Always available when you're ready to learn.", 
    icon: <FiActivity className="text-2xl" />,
    color: "bg-green-50 text-green-600"
  },
  { 
    id: 5,
    title: "Expert Mentors", 
    value: 85, 
    suffix: "+", 
    desc: "Learn directly from Senior Engineers and Architects.", 
    icon: <FiUserCheck className="text-2xl" />,
    color: "bg-rose-50 text-rose-600"
  },
  { 
    id: 6,
    title: "Hiring Partners", 
    value: 150, 
    suffix: "+", 
    desc: "Top product companies hiring our graduates.", 
    icon: <FiBriefcase className="text-2xl" />,
    color: "bg-indigo-50 text-indigo-600"
  },
];

/* ===============================
   COUNT UP COMPONENT
================================ */
function CountUp({ value, suffix, trigger }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf;
    const duration = 1500;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); 
      const current = eased * value;

      setCount(value % 1 === 0 ? Math.floor(current) : current.toFixed(1));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, trigger]);

  return (
    <span className="tabular-nums tracking-tight">
      {count}{suffix}
    </span>
  );
}

/* ===============================
   MAIN SECTION
================================ */
export default function StatsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: true });
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (isInView) setTrigger((t) => t + 1);
  }, [isInView]);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white overflow-hidden" 
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-3xl mx-auto px-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 tracking-tight"
          >
            Built for <span className="text-gray-500">Scale & Success</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base lg:text-lg text-slate-500"
          >
            Thousands of engineers, from students to enterprises, use TheLinuxSchool to master their craft.
          </motion.p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1, 
                ease: "easeOut" 
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              // UPDATED SHADOWS TO MATCH FACULTY SECTION:
              // Removed shadow-sm and indigo shadow. Added hover:shadow-2xl, hover:shadow-slate-200
              className="group bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-8 border border-slate-200 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 hover:border-slate-300"
            >
              {/* TOP ROW: ICON & GRAPHIC ELEMENT */}
              <div className="flex justify-between items-start mb-5 sm:mb-6 md:mb-8">
                {/* Icon Box */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </div>

                {/* Decorative Pill */}
                <div className="bg-slate-50 px-2 sm:px-3 py-1 rounded-full border border-slate-100">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>
              </div>

              {/* STAT NUMBER */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tighter">
                <CountUp value={stat.value} suffix={stat.suffix} trigger={trigger} />
              </h3>

              {/* TEXT CONTENT */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2">
                  {stat.title}
                </h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  {stat.desc}
                </p>
              </div>

              {/* SUBTLE HOVER GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[32px]" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}