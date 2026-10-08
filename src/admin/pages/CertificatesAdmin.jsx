import { useEffect, useState } from "react";
import { listCertificatesAdmin, issueCertificate, revokeCertificate, listStudents, listCoursesAdmin } from "../lib/adminApi";
import { Spinner, EmptyState, Field, Select, StatusBadge, PrimaryButton, ConfirmDialog, useToasts } from "../components/ui";

export default function CertificatesAdmin() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [form, setForm] = useState({ student_id: "", course_id: "" });
  const [busy, setBusy] = useState(false);
  const [revokeId, setRevokeId] = useState(null);
  const { push, stack } = useToasts();

  const load = async () => {
    setLoading(true);
    try {
      const [c, s, co] = await Promise.all([listCertificatesAdmin(100), listStudents(""), listCoursesAdmin("")]);
      setItems(c);
      setStudents(s);
      setCourses(co);
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const issue = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const student = students.find((s) => s.id === form.student_id);
      const cert = await issueCertificate({
        student_id: form.student_id,
        student_email: student?.email || null,
        course_id: form.course_id,
      });
      push(`Certificate ${cert.certificate_no} issued.`);
      setIssuing(false);
      setForm({ student_id: "", course_id: "" });
      await load();
    } catch (err) {
      push(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (!revokeId) return;
    setBusy(true);
    try {
      await revokeCertificate(revokeId);
      setItems((prev) => prev.filter((c) => c.id !== revokeId));
      push("Certificate revoked.");
    } catch (e) {
      push(e.message, "error");
    } finally {
      setBusy(false);
      setRevokeId(null);
    }
  };

  return (
    <div>
      {stack}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Certificates</h1>
          <p className="text-[13px] text-gray-500 mt-1">Auto-issued on completion — or issue one manually here.</p>
        </div>
        <PrimaryButton onClick={() => setIssuing(!issuing)}>+ Issue certificate</PrimaryButton>
      </div>

      {issuing && (
        <form onSubmit={issue} className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-extrabold">Issue manually</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Student *">
              <Select value={form.student_id} onChange={(e) => setForm((f) => ({ ...f, student_id: e.target.value }))}>
                <option value="">— Choose student —</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.email}</option>
                ))}
              </Select>
            </Field>
            <Field label="Course *">
              <Select value={form.course_id} onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}>
                <option value="">— Choose course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </Select>
            </Field>
          </div>
          <p className="text-[12px] text-gray-500">The linked course badge is awarded too, mirroring automatic completion.</p>
          <PrimaryButton type="submit" disabled={busy}>{busy ? "Issuing…" : "Issue certificate"}</PrimaryButton>
        </form>
      )}

      <div className="mt-5">
        {loading ? (
          <Spinner label="Loading certificates…" />
        ) : items.length === 0 ? (
          <EmptyState title="No certificates yet" hint="They appear automatically when students finish courses, or issue one manually." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-x-auto">
            {items.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 min-w-[560px]">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-[13px] font-mono">{c.certificate_no}</p>
                  <p className="text-[12px] text-gray-500">
                    {c.profiles?.email || c.student_email || "Student"} · {c.courses?.title || "Deleted course"}
                  </p>
                </div>
                <StatusBadge status={c.status} />
                <span className="text-[12px] text-gray-400">{c.issued_at ? new Date(c.issued_at).toLocaleDateString() : ""}</span>
                <button onClick={() => setRevokeId(c.id)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!revokeId}
        title="Revoke this certificate?"
        body="It disappears from the student's dashboard immediately. This cannot be undone."
        confirmLabel="Revoke"
        busy={busy}
        onCancel={() => setRevokeId(null)}
        onConfirm={revoke}
      />
    </div>
  );
}
