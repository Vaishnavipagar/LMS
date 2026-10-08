import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse } from "../data/courses";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  getPublishedCourse, thumbnailUrl, signedVideoUrl, signedNoteUrl,
  formatPrice, formatDuration,
} from "../lib/coursesApi";
import { isEnrolledIn } from "../lib/enrollmentsApi";
import { markLessonComplete, awardOnCompletion, completedLessonIds } from "../lib/progressApi";
import { LockIcon, DocIcon, CheckIcon } from "../components/icons";
import EnrollPanel from "../components/EnrollPanel";

function enrolledKey(id) {
  return `learnaxis_enrolled_${id}`;
}

function Stars({ n }) {
  return <span className="text-yellow-400">{"★".repeat(Math.max(0, Math.min(5, n || 5)))}</span>;
}

// ---------------- static (offline demo) course — unchanged behavior ----------------
function StaticCourse({ course }) {
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(() => !!localStorage.getItem(enrolledKey(course.id)));

  const enroll = () => {
    if (!localStorage.getItem("learnaxis_user")) {
      navigate("/login");
      return;
    }
    localStorage.setItem(enrolledKey(course.id), "1");
    setEnrolled(true);
  };

  return (
    <div className="bg-[#F6F0E6] min-h-screen pt-24 pb-16">
      <div className="w-full max-w-4xl mx-auto px-5">
        <img src={course.img} alt={course.title} className="block w-full h-72 object-cover rounded-2xl" />
        <p className="text-[12px] text-gray-500 font-semibold mt-5">{course.cat} • {course.instructor}</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">{course.title}</h1>
        <p className="text-sm text-gray-500 mt-3">
          {course.students} students · {course.lessons} lessons · <Stars n={5} /> ({course.reviews} Reviews)
        </p>
        {enrolled && (
          <p className="mt-4 text-[13px] font-bold text-[#2f6b1f] bg-[#EDF4DC] border border-[#2f6b1f]/20 rounded-lg px-4 py-3">
            Enrolled. Start with lesson 1 — your progress saves in this browser demo.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={enroll}
            className={`rounded-full px-7 py-3 text-sm font-extrabold transition ${enrolled ? "bg-[#191817] text-white" : "bg-[#F5820B] text-white hover:bg-[#E06F00]"}`}
          >
            {enrolled ? "Enrolled ✓" : `Enroll for ${course.price}`}
          </button>
          <button onClick={() => navigate("/courses")} className="rounded-lg border border-gray-300 bg-white px-7 py-3 text-sm font-bold hover:border-black transition">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- live Supabase course ----------------
function LiveCourse({ course }) {
  const navigate = useNavigate();
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [done, setDone] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase().auth.getSession();
        const user = data?.session?.user || null;
        setUid(user?.id || null);
        setEmail(user?.email || "");
        if (user) {
          const yes = await isEnrolledIn(course.id);
          setEnrolled(!!yes);
          if (yes) {
            const set = await completedLessonIds(user.id, course.id).catch(() => new Set());
            setDone(set);
            const total = (course.lessons || []).length;
            setProgress(total ? Math.round((set.size / total) * 100) : 0);
          }
        }
      } catch {
        /* offline-safe */
      } finally {
        setChecking(false);
      }
    })();
  }, [course.id, course.lessons]);

  // Re-checks enrollment after EnrollPanel completes payment.
  const refreshEnrollment = async () => {
    const yes = await isEnrolledIn(course.id);
    setEnrolled(!!yes);
  };

  const watch = async (lesson) => {
    if (!enrolled) return;
    setActiveLesson(lesson);
    setVideoUrl(null);
    if (!lesson.video_path) return;
    setVideoLoading(true);
    try {
      setVideoUrl(await signedVideoUrl(lesson.video_path));
    } catch (e) {
      setError(e.message || "Could not load video.");
    } finally {
      setVideoLoading(false);
    }
  };

  const complete = async (lesson) => {
    if (!uid) return;
    try {
      const total = (course.lessons || []).length;
      const { pct } = await markLessonComplete({ studentId: uid, courseDbId: course.id, lessonId: lesson.id, totalLessons: total });
      setDone((prev) => new Set(prev).add(lesson.id));
      setProgress(pct);
      if (pct >= 100) {
        const got = await awardOnCompletion({ studentId: uid, studentEmail: email, courseDbId: course.id, courseTitle: course.title });
        const msgs = [];
        if (got.badge) msgs.push({ icon: "badge", text: `Badge earned: ${got.badge.name}` });
        if (got.certificate) msgs.push({ icon: "certificate", text: `Certificate issued: ${got.certificate.certificate_no}` });
        if (msgs.length) setAwards(msgs);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const openNote = async (res) => {
    try {
      const url = await signedNoteUrl(res.file_path, 600);
      if (url) window.open(url, "_blank", "noopener");
    } catch (e) {
      setError(e.message || "Could not open file.");
    }
  };

  const notesFor = (lessonId) => (course.resources || []).filter((r) => r.lesson_id === lessonId);
  const courseNotes = (course.resources || []).filter((r) => !r.lesson_id);
  const img = thumbnailUrl(course.thumbnail_path);

  return (
    <div className="bg-[#F6F0E6] min-h-screen pt-24 pb-16">
      <div className="w-full max-w-4xl mx-auto px-5">
        {img && <img src={img} alt={course.title} className="block w-full h-72 object-cover rounded-2xl" />}
        <p className="text-[12px] text-gray-500 font-semibold mt-5">
          {course.categories?.name || "General"} • {course.instructors?.name || "LearnLoop"} • {course.level}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">{course.title}</h1>
        {course.short_description && <p className="text-[15px] text-gray-700 font-medium mt-2">{course.short_description}</p>}
        {course.description && <p className="text-sm text-gray-500 mt-3 leading-relaxed">{course.description}</p>}
        <p className="text-sm text-gray-500 mt-3">
          {(course.lessons || []).length} lessons
          {course.duration_minutes ? ` · ${formatDuration(course.duration_minutes)}` : ""} · {formatPrice(course.price)}
        </p>

        {error && <p className="mt-4 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
        {awards.map((a) => (
          <p key={a.text} className="mt-3 text-[13px] font-bold text-[#2f6b1f] bg-[#EDF4DC] border border-[#2f6b1f]/20 rounded-lg px-4 py-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#2f6b1f] text-white grid place-items-center shrink-0">
              <CheckIcon size={11} />
            </span>
            {a.text}
          </p>
        ))}

        <div className="mt-6">
          <EnrollPanel course={course} uid={uid} email={email} enrolled={enrolled} progress={progress} onEnrolled={refreshEnrollment} />
        </div>
        {!uid && !checking && (
          <p className="text-[13px] text-gray-500 mt-3">Log in to enroll and unlock videos and notes. <button onClick={() => navigate("/login")} className="font-bold text-black hover:underline">Login →</button></p>
        )}

        {enrolled && (
          <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full bg-[#F5820B] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <h2 className="text-lg font-extrabold mt-10 mb-3">Lessons ({(course.lessons || []).length})</h2>
        {(course.lessons || []).length === 0 && <p className="text-sm text-gray-500">Lessons are being added to this course.</p>}
        <div className="space-y-3">
          {(course.lessons || []).map((l, i) => {
            const isDone = done.has(l.id);
            const isActive = activeLesson?.id === l.id;
            return (
              <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`w-8 h-8 rounded-full grid place-items-center text-[12px] font-extrabold shrink-0 ${isDone ? "bg-green-600 text-white" : "bg-gray-100"}`}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <div className="flex-1 min-w-[160px]">
                    <p className="font-bold text-[14px]">{l.title}</p>
                    <p className="text-[12px] text-gray-500">{l.duration_minutes ? `${l.duration_minutes} min` : ""}{notesFor(l.id).length ? ` · ${notesFor(l.id).length} note${notesFor(l.id).length > 1 ? "s" : ""}` : ""}</p>
                  </div>
                  {enrolled ? (
                    <>
                      <button onClick={() => watch(l)} disabled={!l.video_path} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-40">
                        {l.video_path ? "Watch" : "No video"}
                      </button>
                      {!isDone && (
                        <button onClick={() => complete(l)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
                          Mark complete
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-[12px] font-bold text-gray-400 inline-flex items-center gap-1.5">
                      <LockIcon size={12} /> Enroll to unlock
                    </span>
                  )}
                </div>

                {isActive && enrolled && (
                  <div className="mt-3">
                    {videoLoading && <p className="text-[13px] text-gray-500">Loading secure video…</p>}
                    {!videoLoading && !videoUrl && l.video_path && <p className="text-[13px] text-red-600">Video unavailable — your enrollment may not include this lesson.</p>}
                    {videoUrl && <video controls src={videoUrl} className="w-full max-h-80 rounded-xl bg-black" preload="metadata" />}
                    {l.description && <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">{l.description}</p>}
                    {notesFor(l.id).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {notesFor(l.id).map((r) => (
                          <button key={r.id} onClick={() => openNote(r)} className="text-[12px] font-bold px-4 py-2 rounded-full border border-gray-300 bg-white hover:border-black transition inline-flex items-center gap-1.5">
                            <DocIcon size={12} /> {r.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {courseNotes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-extrabold mb-3">Course notes & resources</h2>
            <div className="flex flex-wrap gap-2">
              {courseNotes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => (enrolled ? openNote(r) : navigate("/login"))}
                  className="text-[12px] font-bold px-4 py-2 rounded-full border border-gray-300 bg-white hover:border-black transition inline-flex items-center gap-1.5"
                >
                  <DocIcon size={12} /> {r.title}
                  {!enrolled && <LockIcon size={11} className="text-gray-400" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- router ----------------
export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const staticCourse = getCourse(courseId);
  const [live, setLive] = useState(null);
  const [checked, setChecked] = useState(!!staticCourse || !isSupabaseConfigured());

  useEffect(() => {
    if (staticCourse || !isSupabaseConfigured()) return;
    getPublishedCourse(courseId).then((c) => {
      setLive(c);
      setChecked(true);
    });
  }, [courseId, staticCourse]);

  if (staticCourse) return <StaticCourse course={staticCourse} />;
  if (!checked) {
    return (
      <div className="bg-[#F6F0E6] min-h-screen pt-32 pb-16 text-center">
        <p className="font-bold">Loading course…</p>
      </div>
    );
  }
  if (live) return <LiveCourse course={live} />;
  return (
    <div className="min-h-screen bg-white pt-32 text-center px-6">
      <h1 className="text-xl font-extrabold">Course not found</h1>
      <button onClick={() => navigate("/courses")} className="mt-5 rounded-full bg-[#191817] text-white px-6 py-3 text-sm font-bold">
        Back to courses
      </button>
    </div>
  );
}
