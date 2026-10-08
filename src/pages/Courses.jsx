import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TABS, coursesByTab } from "../data/courses";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { myEnrollments } from "../lib/enrollmentsApi";
import EnrollPanel from "../components/EnrollPanel";
import { listPublishedCourses, getPublishedCourse, thumbnailUrl, formatPrice, formatDuration } from "../lib/coursesApi";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&q=80&auto=format&fit=crop";

// Live Supabase courses are prepended; static demo courses remain as the
// offline fallback (and show when Supabase has no published courses yet).
function toCard(c) {
  const cat = c.categories?.name || "General";
  const tab = TABS.find((t) => t.toLowerCase() === cat.toLowerCase()) || null;
  return {
    id: c.slug || c.id,
    dbId: c.id,
    title: c.title,
    cat,
    tab,
    instructor: c.instructors?.name || "LearnLoop",
    price: formatPrice(c.price),
    img: thumbnailUrl(c.thumbnail_path) || FALLBACK_IMG,
    lessons: c.lesson_count ?? 0,
    students: c.student_count ?? 0,
    live: true,
  };
}

export default function Courses() {
  const [tab, setTab] = useState("All");
  const [live, setLive] = useState([]);
  const [session, setSession] = useState(null);
  const [enrolledMap, setEnrolledMap] = useState({});
  const [checkout, setCheckout] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    listPublishedCourses().then((rows) => {
      if (rows && rows.length) setLive(rows.map(toCard));
    });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase().auth.getSession().then(async ({ data }) => {
      const user = data?.session?.user || null;
      setSession(user);
      if (user) {
        const rows = await myEnrollments().catch(() => null);
        if (rows) {
          const map = {};
          rows.forEach((e) => {
            const cid = e.course_id || e.courses?.id;
            if (cid) map[cid] = e.progress || 0;
          });
          setEnrolledMap(map);
        }
      }
    });
  }, []);

  const openCheckout = async (card) => {
    if (enrolledMap[card.dbId] != null) {
      navigate(`/course/${card.id}`);
      return;
    }
    setCheckoutLoading(true);
    try {
      const full = await getPublishedCourse(card.id);
      setCheckout(full || { ...card, id: card.dbId });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const closeCheckout = () => setCheckout(null);

  const handleEnrolled = async () => {
    setEnrolledMap((m) => ({ ...m, [checkout.id]: 0 }));
    const rows = await myEnrollments().catch(() => null);
    if (rows) {
      const map = {};
      rows.forEach((e) => {
        const cid = e.course_id || e.courses?.id;
        if (cid) map[cid] = e.progress || 0;
      });
      setEnrolledMap(map);
    }
  };

  const liveVisible = live.filter((c) => tab === "All" || c.tab === tab);
  const list = [...liveVisible, ...coursesByTab(tab)];

  return (
    <div>
      <div className="bg-[#191817] pt-24 pb-10">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">All courses</h1>
          <p className="text-white/60 text-[13px] mt-2">Development, business, design and marketing tracks.</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-[12px] font-bold border transition ${
                  tab === t ? "bg-[#F5820B] text-white border-[#F5820B]" : "bg-transparent text-white/80 border-white/25 hover:border-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F6F0E6]">
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
                <button onClick={() => navigate(`/course/${c.id}`)} className="mt-4 w-full rounded-full bg-[#F5820B] text-white text-[13px] font-bold py-2.5 hover:bg-[#E06F00] transition">
                  View course
                </button>
                {c.live && (
                  <button
                    onClick={() => openCheckout(c)}
                    disabled={checkoutLoading}
                    className="mt-2 w-full rounded-full border border-[#191817] text-[#191817] text-[13px] font-bold py-2.5 hover:bg-[#191817] hover:text-white transition disabled:opacity-50"
                  >
                    {enrolledMap[c.dbId] != null ? "Enrolled ✓ — Go to course" : `Enroll now • ${c.price}`}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {checkoutLoading && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl px-8 py-6 text-sm font-bold">Loading checkout…</div>
        </div>
      )}

      {checkout && !checkoutLoading && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4" onClick={closeCheckout}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-gray-500 font-semibold">
                  {(checkout.categories?.name || checkout.cat || "General")} • {(checkout.instructors?.name || checkout.instructor || "LearnLoop")}
                </p>
                <h3 className="font-extrabold text-lg leading-snug mt-1">{checkout.title}</h3>
              </div>
              <button onClick={closeCheckout} className="text-gray-400 hover:text-black text-xl leading-none px-1" aria-label="Close">×</button>
            </div>
            {(checkout.short_description || checkout.desc) && (
              <p className="text-[13px] text-gray-600 mt-2">{checkout.short_description || checkout.desc}</p>
            )}
            <p className="text-[13px] text-gray-500 font-semibold mt-3">
              {(checkout.lessons?.length ?? checkout.lessons ?? 0)} lessons
              {(checkout.duration_minutes || checkout.hours) ? ` · ${formatDuration(checkout.duration_minutes) || checkout.hours}` : ""}
              {" · "}{checkout.price != null && typeof checkout.price === "number" ? formatPrice(checkout.price) : checkout.price}
            </p>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <EnrollPanel
                course={{ id: checkout.id, title: checkout.title, price: Number(checkout.price) || 0 }}
                uid={session?.id}
                email={session?.email}
                enrolled={enrolledMap[checkout.id] != null}
                progress={enrolledMap[checkout.id] || 0}
                onEnrolled={handleEnrolled}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
