import { useEffect, useState } from "react";
import { listInstructors, saveInstructor, deleteInstructor } from "../lib/adminApi";
import { Spinner, EmptyState, Field, TextInput, Textarea, PrimaryButton, GhostButton, ConfirmDialog, useToasts } from "../components/ui";

export default function InstructorsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", title: "", bio: "" });
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const { push, stack } = useToasts();

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listInstructors());
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

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveInstructor({ id: editing === "new" ? null : editing, ...form });
      push("Instructor saved.");
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
      await deleteInstructor(confirmId);
      setItems((prev) => prev.filter((t) => t.id !== confirmId));
      push("Instructor deleted. Their courses now show no instructor.");
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
          <h1 className="text-2xl font-extrabold tracking-tight">Instructors</h1>
          <p className="text-[13px] text-gray-500 mt-1">Shown on course cards and detail pages.</p>
        </div>
        <PrimaryButton onClick={() => { setEditing("new"); setForm({ name: "", title: "", bio: "" }); }}>+ New instructor</PrimaryButton>
      </div>

      {editing && (
        <form onSubmit={submit} className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-extrabold">{editing === "new" ? "New instructor" : "Edit instructor"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *">
              <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Aarav Sharma" />
            </Field>
            <Field label="Title">
              <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Senior Frontend Engineer" />
            </Field>
          </div>
          <Field label="Bio">
            <Textarea rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Short professional background…" />
          </Field>
          <div className="flex gap-3">
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</PrimaryButton>
            <GhostButton type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</GhostButton>
          </div>
        </form>
      )}

      <div className="mt-5">
        {loading ? (
          <Spinner label="Loading instructors…" />
        ) : items.length === 0 ? (
          <EmptyState title="No instructors" hint="Add the people who teach your courses." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {items.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="flex-1 min-w-[160px]">
                  <p className="font-bold text-[14px]">{t.name}</p>
                  <p className="text-[12px] text-gray-400">{t.title || "—"}</p>
                </div>
                <button onClick={() => { setEditing(t.id); setForm({ name: t.name || "", title: t.title || "", bio: t.bio || "" }); }} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">Edit</button>
                <button onClick={() => setConfirmId(t.id)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this instructor?"
        body="Their courses will simply show no instructor. This cannot be undone."
        busy={busy}
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
