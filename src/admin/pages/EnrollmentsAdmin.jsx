import { useEffect, useState } from "react";
import { listStudents, listEnrollmentsAdmin, deleteEnrollment } from "../lib/adminApi";
import { Spinner, EmptyState, StatusBadge, ConfirmDialog, useToasts } from "../components/ui";

export default function EnrollmentsAdmin() {
  const [tab, setTab] = useState("enrollments");
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);
  const { push, stack } = useToasts();

  const load = async (q = "") => {
    setLoading(true);
    try {
      const [e, s] = await Promise.all([listEnrollmentsAdmin(100), listStudents(q)]);
      setEnrollments(e);
      setStudents(s);
    } catch (err) {
      push(err.message, "error");
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

  const remove = async () => {
    if (!confirmId) return;
    setBusy(true);
    try {
      await deleteEnrollment(confirmId);
      setEnrollments((prev) => prev.filter((e) => e.id !== confirmId));
      push("Enrollment removed. The student loses access to that course.");
    } catch (e) {
      push(e.message, "error");
    } finally {
      setBusy(false);
      setConfirmId(null);
    }
  };

  return (
    <div>
      {stack}
      <h1 className="text-2xl font-extrabold tracking-tight">Students & enrollments</h1>
      <p className="text-[13px] text-gray-500 mt-1">Read-only data from the website. Removing an enrollment revokes course access.</p>

      <div className="flex gap-2 mt-5">
        {["enrollments", "students"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-full text-[13px] font-bold border transition capitalize ${
              tab === t ? "bg-[#191817] text-white border-[#191817]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {t} ({t === "enrollments" ? enrollments.length : students.length})
          </button>
        ))}
      </div>

      {tab === "students" && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students by email…"
          className="mt-4 w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
        />
      )}

      <div className="mt-4">
        {loading ? (
          <Spinner label="Loading…" />
        ) : tab === "enrollments" ? (
          enrollments.length === 0 ? (
            <EmptyState title="No enrollments yet" hint="Enrollments from the website appear here automatically." />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-x-auto">
              {enrollments.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 min-w-[560px]">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold text-[13px]">{e.profiles?.email || e.student_email || "Student"}</p>
                    <p className="text-[12px] text-gray-500">{e.courses?.title || "Deleted course"}</p>
                  </div>
                  <span className="text-[12px] text-gray-500">{e.progress}%</span>
                  <StatusBadge status={e.status} />
                  <span className="text-[12px] text-gray-400">{new Date(e.enrolled_at).toLocaleDateString()}</span>
                  <button onClick={() => setConfirmId(e.id)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )
        ) : students.length === 0 ? (
          <EmptyState title="No students found" hint="Student accounts appear here after signing up on the website." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-x-auto">
            {students.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 min-w-[560px]">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-[13px]">
                    {[s.first_name, s.last_name].filter(Boolean).join(" ") || s.email}
                  </p>
                  <p className="text-[12px] text-gray-500">{s.email} · {s.mobile || "no mobile"}</p>
                  <p className="text-[11px] text-gray-400">
                    Last sign-in: {s.last_sign_in_at ? new Date(s.last_sign_in_at).toLocaleString() : "never"}
                  </p>
                </div>
                <span className="text-[12px] text-gray-500">{s.enrollment_count} courses</span>
                <StatusBadge status={s.role} />
                <span className="text-[12px] text-gray-400">{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Remove this enrollment?"
        body="The student immediately loses access to the course videos and notes. Their payment record is kept."
        busy={busy}
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
