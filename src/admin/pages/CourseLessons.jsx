import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCourseAdmin, listLessonsAdmin, saveLesson, setLessonPublished, deleteLesson,
  listResourcesAdmin, uploadResource, deleteResource, signedFileUrl,
} from "../lib/adminApi";
import { Spinner, EmptyState, Field, TextInput, Textarea, PrimaryButton, GhostButton, ConfirmDialog, useToasts } from "../components/ui";

const EMPTY_LESSON = { title: "", description: "", position: "0", duration_minutes: "0", is_published: false };

function formatBytes(n) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function ResourcesManager({ courseId, lessonId, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const { push, stack } = useToasts();

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listResourcesAdmin(courseId, lessonId));
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId, refreshKey]);

  const upload = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await uploadResource({ courseId, lessonId, title, file });
      setTitle("");
      setFile(null);
      e.target.reset?.();
      await load();
      push("Note/resource uploaded to private storage.");
    } catch (err) {
      push(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const preview = async (item) => {
    try {
      const url = await signedFileUrl("course-notes", item.file_path, 600);
      window.open(url, "_blank", "noopener");
    } catch (err) {
      push(err.message, "error");
    }
  };

  const remove = async () => {
    if (!confirmId) return;
    setBusy(true);
    try {
      await deleteResource(confirmId);
      setItems((prev) => prev.filter((r) => r.id !== confirmId));
      push("Resource deleted.");
    } catch (err) {
      push(err.message, "error");
    } finally {
      setBusy(false);
      setConfirmId(null);
    }
  };

  return (
    <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-4">
      {stack}
      <p className="text-[12px] font-extrabold uppercase tracking-wider text-gray-500">
        {lessonId ? "Lesson notes / resources (private PDFs)" : "Course-level notes / resources"}
      </p>
      {loading ? (
        <p className="text-[13px] text-gray-500 mt-2">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-[13px] text-gray-400 mt-2">No files yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-2 text-[13px] bg-white rounded-lg px-3 py-2 border border-gray-100">
              <span className="font-bold truncate flex-1 min-w-[140px]">{r.title}</span>
              <span className="text-gray-400 text-[11px]">{formatBytes(r.file_size)}</span>
              <button onClick={() => preview(r)} className="text-[12px] font-bold text-[#F5820B] hover:underline">Preview</button>
              <button onClick={() => setConfirmId(r.id)} className="text-[12px] font-bold text-red-600 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={upload} className="flex flex-col sm:flex-row gap-2 mt-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title, e.g. Lesson 1 slides (PDF)"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-[13px] outline-none focus:border-[#F5820B]"
        />
        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-[12px] text-gray-600 self-center" />
        <PrimaryButton type="submit" disabled={busy} className="!py-2 !px-5 !text-[12px]">
          {busy ? "Uploading…" : "Upload"}
        </PrimaryButton>
      </form>
      <ConfirmDialog
        open={!!confirmId}
        title="Delete this file?"
        body="The file will be removed from private storage and the database. Students lose access immediately."
        busy={busy}
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

export default function CourseLessons() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // null = hidden, "new" = create
  const [form, setForm] = useState(EMPTY_LESSON);
  const [fieldErrors, setFieldErrors] = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState({});
  const { push, stack } = useToasts();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [c, l] = await Promise.all([getCourseAdmin(courseId), listLessonsAdmin(courseId)]);
      setCourse(c);
      setLessons(l);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const openNew = () => {
    setEditingId("new");
    setForm({ ...EMPTY_LESSON, position: String(lessons.length) });
    setFieldErrors({});
    setVideoFile(null);
    setRemoveVideo(false);
  };

  const openEdit = (lesson) => {
    setEditingId(lesson.id);
    setForm({
      title: lesson.title || "",
      description: lesson.description || "",
      position: String(lesson.position ?? 0),
      duration_minutes: String(lesson.duration_minutes ?? 0),
      is_published: !!lesson.is_published,
    });
    setFieldErrors({});
    setVideoFile(null);
    setRemoveVideo(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveLesson({
        courseId,
        id: editingId === "new" ? null : editingId,
        input: form,
        videoFile,
        removeVideo,
      });
      push(editingId === "new" ? "Lesson added." : "Lesson saved.");
      setEditingId(null);
      await load();
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      push(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (lesson) => {
    try {
      await setLessonPublished(lesson.id, !lesson.is_published);
      setLessons((prev) => prev.map((l) => (l.id === lesson.id ? { ...l, is_published: !l.is_published } : l)));
    } catch (e) {
      push(e.message, "error");
    }
  };

  const remove = async () => {
    if (!confirmId) return;
    setBusy(true);
    try {
      await deleteLesson(confirmId);
      setLessons((prev) => prev.filter((l) => l.id !== confirmId));
      push("Lesson deleted with its video and notes.");
    } catch (e) {
      push(e.message, "error");
    } finally {
      setBusy(false);
      setConfirmId(null);
    }
  };

  const loadPreview = async (lesson) => {
    if (!lesson.video_path) return;
    try {
      const url = await signedFileUrl("course-videos", lesson.video_path, 600);
      setPreviewUrl((prev) => ({ ...prev, [lesson.id]: url }));
    } catch (e) {
      push(e.message, "error");
    }
  };

  if (loading) return <Spinner label="Loading lessons…" />;
  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <p className="font-extrabold">Could not load this course</p>
        <p className="text-sm text-red-600 mt-2">{error}</p>
        <Link to="/admin/courses" className="text-[13px] font-bold text-[#F5820B] hover:underline mt-3 inline-block">← Back to courses</Link>
      </div>
    );
  }

  return (
    <div>
      {stack}
      <Link to="/admin/courses" className="text-[13px] font-bold text-gray-500 hover:text-black">← Courses</Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{course?.title}</h1>
          <p className="text-[13px] text-gray-500 mt-1">Lessons, videos and notes. Publish a lesson to make it visible on the website.</p>
        </div>
        <PrimaryButton onClick={openNew}>+ Add lesson</PrimaryButton>
      </div>

      {editingId && (
        <form onSubmit={submit} className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-extrabold">{editingId === "new" ? "New lesson" : "Edit lesson"}</h2>
          <Field label="Lesson title *" error={fieldErrors.title}>
            <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Introduction & setup" />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="What this lesson covers…" />
          </Field>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Order *" error={fieldErrors.position}>
              <TextInput type="number" min="0" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} />
            </Field>
            <Field label="Duration (min) *" error={fieldErrors.duration_minutes}>
              <TextInput type="number" min="0" value={form.duration_minutes} onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))} />
            </Field>
            <label className="flex items-center gap-2 text-[13px] font-bold self-end pb-3">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-[#F5820B]" />
              Published
            </label>
          </div>
          <Field label="Video file" hint="MP4 up to 500 MB. Stored privately; students get secure expiring links.">
            <input type="file" accept="video/*" onChange={(e) => { setVideoFile(e.target.files?.[0] || null); setRemoveVideo(false); }} className="text-sm text-gray-600" />
            {videoFile && <p className="text-[12px] text-gray-600 mt-1">Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
          </Field>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving…" : editingId === "new" ? "Add lesson" : "Save lesson"}</PrimaryButton>
            <GhostButton type="button" disabled={busy} onClick={() => setEditingId(null)}>Cancel</GhostButton>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {lessons.length === 0 && !editingId && (
          <EmptyState title="No lessons yet" hint="Add the first lesson above, upload its video, then publish it." action={<PrimaryButton onClick={openNew}>+ Add lesson</PrimaryButton>} />
        )}
        {lessons.map((l, idx) => (
          <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-[12px] font-extrabold shrink-0">{idx + 1}</span>
              <div className="flex-1 min-w-[160px]">
                <p className="font-bold text-[14px]">{l.title}</p>
                <p className="text-[12px] text-gray-500">
                  {l.duration_minutes ? `${l.duration_minutes} min · ` : ""}{l.resource_count} notes · {l.video_path ? "video attached" : "no video"}
                </p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${l.is_published ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                {l.is_published ? "Published" : "Draft"}
              </span>
              <button onClick={() => { setExpandedId(expandedId === l.id ? null : l.id); if (expandedId !== l.id) loadPreview(l); }} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                {expandedId === l.id ? "Hide" : "Manage"}
              </button>
              <button onClick={() => openEdit(l)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">Edit</button>
              <button onClick={() => togglePublish(l)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                {l.is_published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => setConfirmId(l.id)} className="text-[12px] font-bold px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
            </div>

            {expandedId === l.id && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                {l.video_path ? (
                  previewUrl[l.id] ? (
                    <video controls src={previewUrl[l.id]} className="w-full max-h-72 rounded-xl bg-black" preload="metadata" />
                  ) : (
                    <button onClick={() => loadPreview(l)} className="text-[13px] font-bold text-[#F5820B] hover:underline">▶ Load video preview</button>
                  )
                ) : (
                  <p className="text-[13px] text-gray-400">No video uploaded. Edit the lesson to attach one.</p>
                )}
                <ResourcesManager courseId={courseId} lessonId={l.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="font-extrabold mb-2">Course-level notes</h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <ResourcesManager courseId={courseId} lessonId={null} />
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Delete this lesson?"
        body="The lesson, its video and its notes will be permanently deleted. Student progress on it is removed too."
        busy={busy}
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
