import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const items = [
  "Python", "React", "Node.js", "Machine Learning", "Data Science",
  "TensorFlow", "PyTorch", "Django", "Docker", "Kubernetes",
  "PostgreSQL", "Supabase", "AI Agents", "NLP",
];

export default function TrustBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <section ref={ref} className="bg-white border-y border-slate-100 py-7 overflow-hidden">
      <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-400 mb-5">
        What you will master here
      </p>
      <div className="relative">
        <div className="flex w-max gap-3 animate-marquee pr-3">
          {[...items, ...items].map((t, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.5) }}
              className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 whitespace-nowrap hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors cursor-default"
            >
              {t}
            </motion.span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .animate-marquee { animation: marquee 28s linear infinite; } .animate-marquee:hover { animation-play-state: paused; }`}</style>
    </section>
  );
}
