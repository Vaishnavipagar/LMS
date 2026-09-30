import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_COURSES, TABS, coursesByTab } from "../../data/courses";

function Stars() {
  return <span className="text-[#f5b301] text-[11px] tracking-tight">★★★★★</span>;
}

export default function PopularCourses({ limit = 6 }) {
  const [tab, setTab] = useState("All");
  const navigate = useNavigate();
  const list = (tab === "All" ? ALL_COURSES : coursesByTab(tab)).slice(0, limit);
  const counts = Object.fromEntries(TABS.map((t) => [t, t === "All" ? ALL_COURSES.length + 2 : coursesByTab(t).length]));

  return (
    <section id="courses" className="bg-[#f4f6f4]">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Popular courses</h2>
          <div className="hidden sm:flex items-center gap-5 text-[12px] font-semibold text-gray-500">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={tab === t ? "text-black border-b-2 border-black pb-0.5" : "hover:text-black"}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:hidden flex gap-2 mt-5 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-[12px] font-bold border whitespace-nowrap ${
                tab === t ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {t} ({counts[t] ?? 0})
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-gray-500 mt-10">No courses in this category yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {list.map((c) => (
              <article
                key={c.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-xl transition"
              >
                <div className="h-44 overflow-hidden">
                  <img src={c.img} alt={c.title} loading="lazy" className="block w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] text-gray-500 font-semibold">{c.cat} • {c.instructor}</p>
                  <h3 className="font-bold text-[14px] leading-snug mt-1.5 min-h-[40px]">{c.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Stars />
                    <span className="text-[11px] text-gray-400 font-medium">({c.reviews} Reviews)</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                    <span>{c.lessons} Lessons</span>
                    <span>{c.students} students</span>
                  </div>
                  <button
                    onClick={() => navigate(`/course/${c.id}`)}
                    className="mt-4 w-full rounded-lg bg-[#0a4a3c] text-white text-[13px] font-bold py-2.5 hover:bg-[#0d5c4a] transition"
                  >
                    View course
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
