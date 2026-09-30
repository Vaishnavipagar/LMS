import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ARTICLES } from "../../data/articles";

const PER_PAGE = 3;

export default function Articles() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const totalPages = 4;
  const visible = page === 1 ? ARTICLES : [...ARTICLES].reverse();

  return (
    <section id="blog" className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <h2 className="text-2xl font-extrabold tracking-tight">Latest articles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {visible.slice(0, PER_PAGE).map((p) => (
            <article key={p.id} className="group cursor-pointer" onClick={() => navigate("/courses")}>
              <div className="rounded-2xl overflow-hidden h-52">
                <img src={p.img} alt={p.title} loading="lazy" className="block w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <p className="text-[11px] text-gray-400 font-semibold mt-4">◉ {p.author}</p>
              <h3 className="font-bold text-[14px] leading-snug mt-1.5 group-hover:underline">{p.title}</h3>
              <p className="text-[11px] text-gray-400 mt-2">Industry standard dummy text ever since the 1500s.</p>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-5 mt-10 text-[12px] font-bold text-gray-400">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="hover:text-black disabled:opacity-30 px-2" aria-label="previous page">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={page === n ? "text-black border-b-2 border-black" : "hover:text-black"}
            >
              0{n}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="hover:text-black disabled:opacity-30 px-2" aria-label="next page">›</button>
        </div>
      </div>
    </section>
  );
}
