import { useEffect, useState } from "react";
import { listCategories, saveCategory, deleteCategory, slugify } from "../lib/adminApi";
import { Spinner, EmptyState, Field, TextInput, Textarea, PrimaryButton, GhostButton, ConfirmDialog, useToasts } from "../components/ui";

export default function CategoriesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null hidden, "new" create, object edit
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const { push, stack } = useToasts();

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listCategories());
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
    setForm({ name: "", slug: "", description: "" });
  };

  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name || "", slug: c.slug || "", description: c.description || "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveCategory({ id: editing === "new" ? null : editing, ...form });
      push("Category saved.");
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
      await deleteCategory(confirmId);
      setItems((prev) => prev.filter((c) => c.id !== confirmId));
      push("Category deleted. Courses using it now show no category.");
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
          <h1 className="text-2xl font-extrabold tracking-tight">Categories</h1>
          <p className="text-[13px] text-gray-500 mt-1">Used to organize courses on the website.</p>
        </div>
        <PrimaryButton onClick={openNew}>+ New category</PrimaryButton>
      </div>

      {editing && (
        <form onSubmit={submit} className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-extrabold">{editing === "new" ? "New category" : "Edit category"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *">
              <TextInput
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                placeholder="Development"
              />
            </Field>
            <Field label="Slug">
              <TextInput value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="development" />
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <div className="flex gap-3">
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</PrimaryButton>
            <GhostButton type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</GhostButton>
          </div>
        </form>
      )}

      <div className="mt-5">
        {loading ? (
          <Spinner label="Loading categories…" />
        ) : items.length === 0 ? (
          <EmptyState title="No categories" hint="Add one to start organizing courses." action={<PrimaryButton onClick={openNew}>+ New category</PrimaryButton>} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {items.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="flex-1 min-w-[160px]">
                  <p className="font-bold text-[14px]">{c.name}</p>
                  <p className="text-[12px] text-gray-400">/{c.slug}</p>
                </div>
                <button onClick={() => openEdit(c)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">Edit</button>
                <button onClick={() => setConfirmId(c.id)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this category?"
        body="Courses in this category will simply show no category. This cannot be undone."
        busy={busy}
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
