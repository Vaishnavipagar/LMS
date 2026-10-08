import { useEffect, useState } from "react";
import { listBadgesAdmin, saveBadge, deleteBadge, listCoursesAdmin } from "../lib/adminApi";
import { Spinner, EmptyState, Field, TextInput, Textarea, Select, PrimaryButton, GhostButton, ConfirmDialog, useToasts } from "../components/ui";

const EMPTY = { name: "", description: "", icon: "🏅", course_id: "" };
const ICONS = ["🏅", "🎖️", "🏆", "⭐", "🎓", "🚀", "💡", "🔥"];

export default function BadgesAdmin() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const { push, stack } = useToasts();

  const load = async () => {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([listBadgesAdmin(), listCoursesAdmin("")]);
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

  const openNew = () => {
    setEditing("new");
    setForm(EMPTY);
  };

  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ name: b.name || "", description: b.description || "", icon: b.icon || "🏅", course_id: b.courses?.id || "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveBadge({ id: editing === "new" ? null : editing, ...form });
      push("Badge saved. It auto-awards when a student completes the linked course.");
      setEditing(null);
      await load();
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
      await deleteBadge(confirmId);
      setItems((prev) => prev.filter((b) => b.id !== confirmId));
      push("Badge deleted. Already-awarded copies stay with students.");
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
          <h1 className="text-2xl font-extrabold tracking-tight">Badges</h1>
          <p className="text-[13px] text-gray-500 mt-1">Linked badges auto-award on course completion.</p>
        </div>
        <PrimaryButton onClick={openNew}>+ New badge</PrimaryButton>
      </div>

      {editing && (
        <form onSubmit={submit} className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-extrabold">{editing === "new" ? "New badge" : "Edit badge"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *">
              <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="React Finisher" />
            </Field>
            <Field label="Icon">
              <Select value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}>
                {ICONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Awarded for completing…" />
          </Field>
          <Field label="Linked course (auto-award on completion)">
            <Select value={form.course_id} onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}>
              <option value="">— No course link —</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </Select>
          </Field>
          <div className="flex gap-3">
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</PrimaryButton>
            <GhostButton type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</GhostButton>
          </div>
        </form>
      )}

      <div className="mt-5">
        {loading ? (
          <Spinner label="Loading badges…" />
        ) : items.length === 0 ? (
          <EmptyState title="No badges" hint="Create badges students earn by finishing courses." action={<PrimaryButton onClick={openNew}>+ New badge</PrimaryButton>} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {items.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="text-2xl">{b.icon || "🏅"}</span>
                <div className="flex-1 min-w-[160px]">
                  <p className="font-bold text-[14px]">{b.name}</p>
                  <p className="text-[12px] text-gray-500">
                    {b.courses?.title ? `Linked: ${b.courses.title}` : "No course link"} · Awarded {b.awarded_count} time{b.awarded_count === 1 ? "" : "s"}
                  </p>
                </div>
                <button onClick={() => openEdit(b)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">Edit</button>
                <button onClick={() => setConfirmId(b.id)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this badge?"
        body="Future completions will no longer award it. Already-awarded copies stay with students."
        busy={busy}
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
