import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaCode, FaServer, FaPython, FaChartLine, FaRobot } from "react-icons/fa";

const satellites = [
  { icon: <FaBrain />, bg: "bg-violet-600", pos: "top-[20%] left-[38%]", anim: "animate-float", label: "AI" },
  { icon: <FaRobot />, bg: "bg-slate-900", pos: "top-[20%] left-[62%]", anim: "animate-float-reverse", label: "ML" },
  { icon: <FaCode />, bg: "bg-emerald-500", pos: "top-[50%] left-[10%]", anim: "animate-float-delayed", label: "Web" },
  { icon: <FaPython />, bg: "bg-amber-400", pos: "top-[75%] left-[25%]", anim: "animate-float-slower", label: "Python" },
  { icon: <FaServer />, bg: "bg-sky-500", pos: "top-[50%] left-[90%]", anim: "animate-float-slow", label: "Backend" },
  { icon: <FaChartLine />, bg: "bg-rose-500", pos: "top-[75%] left-[75%]", anim: "animate-float-delayed-2", label: "Data" },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden flex flex-col justify-center selection:bg-purple-100"
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-[110px] md:pt-[120px] pb-20 px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="w-full lg:w-[48%] text-center lg:text-left relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI · Web · Backend · Python · Data · ML
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] mb-5"
          >
            Master <span className="text-gray-500">AI,</span>
            <br />
            Web & Backend
            <br />
            Engineering
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg text-slate-500 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            Hands-on tracks in Python, Data Science, Machine Learning, React and
            backend systems — with real projects, code reviews and
            Cloudflare-powered video lessons.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={() => navigate("/#courses")}
              className="bg-slate-900 hover:bg-slate-800 text-white text-base font-bold px-9 py-4 rounded-2xl shadow-lg shadow-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl w-full sm:w-auto"
            >
              Start Learning
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="bg-white border border-slate-200 text-slate-900 text-base font-bold px-9 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 w-full sm:w-auto"
            >
              Browse Courses
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center lg:justify-start gap-5 mt-9 text-sm text-slate-500 font-semibold"
          >
            <div className="flex -space-x-3">
              {[11, 5, 32, 47].map((n) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/64?img=${n}`}
                  alt="learner"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover bg-slate-100"
                  loading="lazy"
                />
              ))}
            </div>
            <p>
              <span className="text-slate-900 font-extrabold">12,480+</span> learners
              <span className="block text-xs font-medium">4.9/5 average rating</span>
            </p>
          </motion.div>
        </div>

        <div className="relative w-full lg:w-[52%] h-[300px] sm:h-[380px] md:h-[500px] scale-[0.7] sm:scale-90 md:scale-100">
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <g stroke="#CBD5E1" strokeWidth="2" fill="none">
              <path d="M50% 50% L50% 35%" />
              <path d="M50% 35% L38% 22%" />
              <path d="M50% 35% L62% 22%" />
              <path d="M50% 50% L25% 50%" />
              <path d="M25% 50% L25% 75%" />
              <path d="M25% 50% L10% 50%" />
              <path d="M50% 50% L75% 50%" />
              <path d="M75% 50% L75% 75%" />
              <path d="M75% 50% L90% 50%" />
            </g>
            <g fill="#4F46E5">
              <circle cx="50%" cy="35%" r="4" />
              <circle cx="38%" cy="22%" r="4" />
              <circle cx="62%" cy="22%" r="4" />
              <circle cx="25%" cy="50%" r="4" />
              <circle cx="25%" cy="75%" r="4" />
              <circle cx="75%" cy="50%" r="4" />
              <circle cx="75%" cy="75%" r="4" />
            </g>
          </svg>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-b from-[#6366F1] to-[#4338CA] rounded-[32px] shadow-[0_20px_50px_rgba(79,70,229,0.4)] flex items-center justify-center text-white border-[4px] border-white"
            >
              <div className="w-12 h-12 rounded-full border-[3px] border-white flex items-center justify-center">
                <FaBrain className="w-6 h-6" />
              </div>
            </motion.div>
          </div>

          {satellites.map((s) => (
            <div key={s.label} className={`absolute ${s.pos} -translate-x-1/2 -translate-y-1/2 z-10 ${s.anim}`}>
              <div
                title={s.label}
                className={`w-14 h-14 md:w-16 md:h-16 ${s.bg} rounded-[20px] shadow-2xl shadow-slate-200 flex items-center justify-center text-white text-2xl border-4 border-white`}
              >
                {s.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100% { transform: translate(-50%,-50%) translateY(0); } 50% { transform: translate(-50%,-50%) translateY(-6px); } }
        @keyframes float-delayed { 0%,100% { transform: translate(-50%,-50%) translateY(0); } 50% { transform: translate(-50%,-50%) translateY(6px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite; }
        .animate-float-slower { animation: float 7s ease-in-out infinite; }
        .animate-float-delayed-2 { animation: float-delayed 4s ease-in-out infinite; }
        .animate-float-reverse { animation: float-delayed 8s ease-in-out infinite reverse; }
        .animate-float-slow { animation: float 5.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
