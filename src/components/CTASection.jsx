import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaFileAlt, FaCertificate, FaInfinity } from "react-icons/fa";

const points = [
  { icon: <FaPlay />, title: "R2-powered video", desc: "Adaptive HLS lessons, posters and fast seeking. No YouTube branding." },
  { icon: <FaFileAlt />, title: "Notes with every lesson", desc: "PDFs, code files and datasets attached to each video." },
  { icon: <FaCertificate />, title: "Certificates + reviews", desc: "Progress tracking, quizzes and mentor-reviewed projects." },
  { icon: <FaInfinity />, title: "Lifetime access", desc: "Pay once, learn forever with free content updates." },
];

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="px-4 sm:px-6 pb-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto bg-slate-950 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 lg:p-16 relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(16,185,129,0.25),transparent_50%)]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-indigo-300 mb-4">Start today</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              Learn AI, Python & web the practical way.
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">Join 12,000+ learners building real projects in AI, backend, data science and machine learning.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate("/signup")} className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold hover:-translate-y-1 hover:shadow-2xl transition-all">
                Create free account
              </button>
              <button onClick={() => navigate("/courses")} className="px-8 py-4 rounded-2xl border border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                Compare tracks
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 backdrop-blur hover:bg-white/[0.1] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center mb-4">{p.icon}</div>
                <h4 className="text-white font-bold mb-1">{p.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
