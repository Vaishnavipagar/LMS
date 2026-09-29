import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaBrain, FaCode, FaChartLine, FaCheck } from "react-icons/fa";

const paths = [
  {
    icon: <FaBrain />, color: "bg-violet-600",
    title: "AI Engineer", time: "4 months",
    steps: ["Python Mastery", "ML Basics + scikit-learn", "Deep Learning + PyTorch", "AI agents + deployment"],
    out: "Build + deploy 4 AI apps",
  },
  {
    icon: <FaCode />, color: "bg-emerald-500",
    title: "Full-Stack Developer", time: "5 months",
    steps: ["React + Tailwind", "Node APIs + Postgres", "Auth + Payments + Storage", "Deploy + Cloudflare R2 video"],
    out: "Ship 5 production apps",
  },
  {
    icon: <FaChartLine />, color: "bg-rose-500",
    title: "Data Scientist", time: "4 months",
    steps: ["Python + SQL", "Pandas + visualization", "Statistics + ML", "Dashboards + portfolio"],
    out: "Publish 3 case studies",
  },
];

export default function LearningPaths() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section id="paths" ref={ref} className="py-20 px-6 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600 mb-3">Roadmaps</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Choose your <span className="text-gray-500">path</span></h2>
          <p className="text-slate-500 mt-4">No confusion. Follow steps in order — each step is a course above.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {paths.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[28px] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-slate-200 transition-all"
            >
              <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>{p.icon}</div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-2xl font-extrabold text-slate-900">{p.title}</h3>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{p.time}</p>
              <ol className="space-y-3 mb-7">
                {p.steps.map((s, n) => (
                  <li key={s} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">{n + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <FaCheck /> {p.out}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
