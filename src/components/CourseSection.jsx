import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaStar } from "react-icons/fa";

/* R2-ready catalog. video_path will later hold R2 master.m3u8 path. */
export const CATALOG = [
  {
    id: "ai-fundamentals", category: "AI", level: "Beginner",
    title: "AI Fundamentals with Python",
    desc: "Python, NumPy, prompts, embeddings and your first AI agent with real APIs.",
    price: "₹1,499", rating: 4.9, lessons: 48, hours: "12h",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
    video_path: null, tag: "Bestseller",
  },
  {
    id: "web-react", category: "Web Dev", level: "Intermediate",
    title: "React Production Bootcamp",
    desc: "Hooks, router, Tailwind, Supabase auth and deployment like this site.",
    price: "₹1,999", rating: 4.8, lessons: 62, hours: "18h",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80&auto=format&fit=crop",
    video_path: null, tag: "Popular",
  },
  {
    id: "backend-node", category: "Backend", level: "Intermediate",
    title: "Backend APIs with Node & Postgres",
    desc: "REST, auth, RLS patterns, Edge Functions, queues and payments.",
    price: "₹1,999", rating: 4.8, lessons: 54, hours: "16h",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop",
    video_path: null, tag: null,
  },
  {
    id: "python-mastery", category: "Python", level: "Beginner",
    title: "Python Mastery: Zero to Backend",
    desc: "OOP, files, APIs, Django basics, automation scripts and testing.",
    price: "₹999", rating: 4.9, lessons: 70, hours: "20h",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80&auto=format&fit=crop",
    video_path: null, tag: "New",
  },
  {
    id: "data-science", category: "Data Science", level: "Intermediate",
    title: "Data Science with Pandas & SQL",
    desc: "Cleaning, visualization, dashboards and statistics for real datasets.",
    price: "₹2,499", rating: 4.7, lessons: 58, hours: "17h",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    video_path: null, tag: null,
  },
  {
    id: "ml-production", category: "ML", level: "Advanced",
    title: "Machine Learning in Production",
    desc: "Scikit-learn, PyTorch basics, model serving, MLOps and R2 video infra.",
    price: "₹2,999", rating: 4.8, lessons: 66, hours: "22h",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80&auto=format&fit=crop",
    video_path: null, tag: "Advanced",
  },
];

export default function CourseSection({ preview = true }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.1, once: true });
  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch("http://localhost/linux/backend/api/admin/admin_courses.php?action=list")
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled && res?.success && Array.isArray(res.data)) setDbCourses(res.data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const list = preview ? CATALOG : [...CATALOG, ...dbCourses];

  return (
    <section
      ref={ref}
      className="py-20 bg-white relative overflow-hidden"
      style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "40px 40px" }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600 mb-3">Tracks</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Explore <span className="text-gray-500">Courses</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl">AI, web development, backend, Python, data science and ML — pick a track, build portfolio projects.</p>
          </div>
          {preview && (
            <button onClick={() => navigate("/courses")} className="self-start md:self-auto px-6 py-3 rounded-xl border border-slate-200 bg-white font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
              View all courses →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {list.map((c, i) => (
            <motion.article
              key={c.id || i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (i % 6) * 0.07 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-[190px] overflow-hidden">
                <img src={c.image || c.thumbnail} alt={c.title} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">{c.category}</span>
                <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-3 py-1 rounded-full">{c.level}</span>
                {c.tag && <span className="absolute bottom-3 left-3 bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full">{c.tag}</span>}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-900"><FaStar className="text-yellow-400" /> {c.rating || "4.8"}</span>
                  <span className="text-xs font-semibold text-slate-500">{c.lessons || "—"} lessons · {c.hours || ""}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{c.title}</h3>
                <p className="text-sm text-slate-500 mb-5 line-clamp-2 flex-1">{c.desc || c.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-extrabold text-slate-900 text-lg">{c.price || "₹999"}</span>
                  <button onClick={() => navigate(`/course/${c.id}`)} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 transition-all">
                    View
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
