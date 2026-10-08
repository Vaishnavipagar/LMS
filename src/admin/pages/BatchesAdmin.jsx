import { useEffect, useState } from "react";
import { listBatchesAdmin, saveBatch, deleteBatch, listCoursesAdmin } from "../lib/adminApi";
import { Spinner, EmptyState, Field, TextInput, Select, StatusBadge, PrimaryButton, GhostButton, ConfirmDialog, useToasts } from "../components/ui";

const EMPTY = { course_id: "", title: "", starts_at: "", ends_at: "", seats: "30", status: "draft" };

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString();
}

export default function BatchesAdmin() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const { push, stack } = useToasts();

  const load = async (courseId = "") => {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([listBatchesAdmin(courseId || null), listCoursesAdmin("")]);
      setItems(b);
      setCourses(c);
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

  useEffect(() => {
    load(filterCourse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCourse]);

  const openNew = () => {
    setEditing("new");
    setForm({ ...EMPTY, course_id: filterCourse || "" });
  };

  const openEdit = (b) => {
    setEditing(b.id);
    setForm({
      course_id: b.courses?.id || "",
      title: b.title || "",
      starts_at: b.starts_at ? b.starts_at.slice(0, 16) : "",
      ends_at: b.ends_at ? b.ends_at.slice(0, 16) : "",
      seats: String(b.seats ?? 0),
      status: b.status || "draft",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveBatch({
        id: editing === "new" ? null : editing,
        course_id: form.course_id,
        title: form.title,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        seats: form.seats,
        status: form.status,
      });
      push("Batch saved.");
      setEditing(null);
      await load(filterCourse);
    } catch (err) {
      push(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirmId) return;
    setBusy(true);
    try {
      await deleteBatch(confirmId);
      setItems((prev) => prev.filter((b) => b.id !== confirmId));
      push("Batch deleted.");
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Batches</h1>
          <p className="text-[13px] text-gray-500 mt-1">Cohorts per course. “Open” batches are visible on the website.</p>
        </div>
        <PrimaryButton onClick={openNew}>+ New batch</PrimaryButton>
      </div>

      <div className="mt-5 max-w-sm">
        <Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </Select>
      </div>

      {editing && (
        <form onSubmit={submit} className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-extrabold">{editing === "new" ? "New batch" : "Edit batch"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Course *">
              <Select value={form.course_id} onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}>
                <option value="">— Choose course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </Select>
            </Field>
            <Field label="Batch title *">
              <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Morning batch – March" />
            </Field>
            <Field label="Starts at">
              <TextInput type="datetime-local" value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} />
            </Field>
            <Field label="Ends at">
              <TextInput type="datetime-local" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} />
            </Field>
            <Field label="Seats">
              <TextInput type="number" min="0" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </Select>
            </Field>
          </div>
          <div className="flex gap-3">
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</PrimaryButton>
            <GhostButton type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</GhostButton>
          </div>
        </form>
      )}

      <div className="mt-5">
        {loading ? (
          <Spinner label="Loading batches…" />
        ) : items.length === 0 ? (
          <EmptyState title="No batches" hint="Create a batch to group students per course and schedule." action={<PrimaryButton onClick={openNew}>+ New batch</PrimaryButton>} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {items.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="flex-1 min-w-[180px]">
                  <p className="font-bold text-[14px]">{b.title}</p>
                  <p className="text-[12px] text-gray-500">
                    {b.courses?.title || "Course"} · {fmt(b.starts_at)} → {fmt(b.ends_at)} · {b.seats} seats
                  </p>
                </div>
                <StatusBadge status={b.status} />
                <button onClick={() => openEdit(b)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">Edit</button>
                <button onClick={() => setConfirmId(b.id)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this batch?"
        body="Students are not unenrolled; only this schedule grouping is removed."
        busy={busy}
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
