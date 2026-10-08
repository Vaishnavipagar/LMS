import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCoursesAdmin, setCourseStatus, deleteCourse } from "../lib/adminApi";
import { thumbnailPublicUrl } from "../../lib/enrollmentsApi";
import { Spinner, EmptyState, StatusBadge, PrimaryButton, ConfirmDialog, useToasts } from "../components/ui";

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { push, stack } = useToasts();

  const load = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      setCourses(await listCoursesAdmin(q));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleStatus = async (course) => {
    const next = course.status === "published" ? "draft" : "published";
    setBusyId(course.id);
    try {
      await setCourseStatus(course.id, next);
      setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, status: next } : c)));
      push(next === "published" ? "Course published — live on the website." : "Course unpublished — hidden from the website.");
    } catch (e) {
      push(e.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    try {
      await deleteCourse(confirm.id);
      setCourses((prev) => prev.filter((c) => c.id !== confirm.id));
      push("Course deleted.");
    } catch (e) {
      push(e.message, "error");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  return (
    <div>
      {stack}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Courses</h1>
          <p className="text-[13px] text-gray-500 mt-1">Publishing a course makes it appear on the website instantly.</p>
        </div>
        <Link to="/admin/courses/new">
          <PrimaryButton>+ New course</PrimaryButton>
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search courses by title…"
        className="mt-5 w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
      />

      {error && <p className="mt-4 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
      {loading ? (
        <Spinner label="Loading courses…" />
      ) : courses.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No courses yet"
            hint="Create your first course — add lessons, videos and notes, then publish it."
            action={<Link to="/admin/courses/new"><PrimaryButton>+ New course</PrimaryButton></Link>}
          />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={thumbnailPublicUrl(c.thumbnail_path) || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&q=60&auto=format&fit=crop"}
                alt=""
                className="w-full sm:w-24 h-32 sm:h-16 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold truncate">{c.title}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-[12px] text-gray-500 mt-1 truncate">
                  /{c.slug} · {c.categories?.name || "No category"} · {c.instructors?.name || "No instructor"} · {c.lesson_count} lessons · ₹{Number(c.price) || 0}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link to={`/admin/courses/${c.id}/lessons`} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  Lessons
                </Link>
                <Link to={`/admin/courses/${c.id}/edit`} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  Edit
                </Link>
                <button
                  disabled={busyId === c.id}
                  onClick={() => toggleStatus(c)}
                  className={`text-[12px] font-bold px-4 py-2 rounded-full transition disabled:opacity-50 ${
                    c.status === "published" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {busyId === c.id ? "…" : c.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  disabled={busyId === c.id}
                  onClick={() => setConfirm(c)}
                  className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete this course?"
        body={`“${confirm?.title}” and ALL its lessons, videos and notes will be permanently deleted. Enrollments stay in history but lose the course link. This cannot be undone.`}
        confirmLabel="Delete course"
        busy={!!busyId}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </div>
  );
}
