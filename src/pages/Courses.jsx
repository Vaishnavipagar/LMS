import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TABS, coursesByTab } from "../data/courses";

export default function Courses() {
  const [tab, setTab] = useState("All");
  const navigate = useNavigate();
  const list = coursesByTab(tab);

  return (
    <div>
      <div className="bg-[#0a4a3c] pt-28 pb-10">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">All courses</h1>
          <p className="text-white/60 text-[13px] mt-2">Development, business, design and marketing tracks.</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold border transition ${
                  tab === t ? "bg-[#f2d90d] text-black border-[#f2d90d]" : "bg-transparent text-white/80 border-white/25 hover:border-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#f4f6f4]">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <article key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-xl transition">
              <div className="h-44 overflow-hidden">
                <img src={c.img} alt={c.title} loading="lazy" className="block w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <p className="text-[11px] text-gray-500 font-semibold">{c.cat} • {c.instructor}</p>
                <h3 className="font-bold text-[14px] leading-snug mt-1.5 min-h-[40px]">{c.title}</h3>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                  <span>{c.lessons} Lessons</span>
                  <span>{c.students} students</span>
                </div>
                <button onClick={() => navigate(`/course/${c.id}`)} className="mt-4 w-full rounded-lg bg-[#0a4a3c] text-white text-[13px] font-bold py-2.5 hover:bg-[#0d5c4a] transition">
                  View course
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
