import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import CourseSection, { CATALOG } from "../components/CourseSection";

const FILTERS = ["All", "AI", "Web Dev", "Backend", "Python", "Data Science", "ML"];

export default function Courses() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return CATALOG.filter((c) => {
      const okCat = active === "All" || c.category === active;
      const okQ = !query || `${c.title} ${c.desc}`.toLowerCase().includes(query.toLowerCase());
      return okCat && okQ;
    });
  }, [active, query]);

  return (
    <div className="pt-[110px] bg-white min-h-screen" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
      <div className="max-w-7xl mx-auto px-6 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">All <span className="text-gray-500">Courses</span></h1>
        <p className="text-slate-500 mt-3 max-w-2xl">Filter by track. Videos stream from Cloudflare R2 (HLS) once backend is connected.</p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Python, React, ML..."
            className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-2.5 mt-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${
                active === f ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="text-sm font-semibold text-slate-400 mt-6">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {active === "All" && !query ? (
        <CourseSection preview={false} />
      ) : (
        <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((c, i) => (
            <motion.article key={c.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all">
              <div className="h-[190px] overflow-hidden relative">
                <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-white/90 text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">{c.category}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{c.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-lg">{c.price}</span>
                  <span className="text-xs font-semibold text-slate-500">{c.lessons} lessons · {c.hours}</span>
                </div>
              </div>
            </motion.article>
          ))}
          {filtered.length === 0 && <p className="text-slate-500 font-medium py-10">No courses match. Try another keyword.</p>}
        </div>
      )}
    </div>
  );
}
