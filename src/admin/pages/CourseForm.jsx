import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getCourseAdmin, saveCourse, listCategories, listInstructors,
  slugify, STATUSES, LEVELS,
} from "../lib/adminApi";
import { thumbnailPublicUrl } from "../../lib/enrollmentsApi";
import { Spinner, Field, TextInput, Textarea, Select, PrimaryButton, GhostButton, useToasts } from "../components/ui";

const EMPTY = {
  title: "", slug: "", description: "", short_description: "",
  instructor_id: "", category_id: "", level: "Beginner",
  price: "0", duration_minutes: "0", status: "draft",
};

export default function CourseForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [thumbFile, setThumbFile] = useState(null);
  const [removeThumb, setRemoveThumb] = useState(false);
  const [currentThumb, setCurrentThumb] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { push, stack } = useToasts();

  useEffect(() => {
    (async () => {
      try {
        const [cats, insts] = await Promise.all([listCategories(), listInstructors()]);
        setCategories(cats);
        setInstructors(insts);
        if (isEdit) {
          const c = await getCourseAdmin(id);
          setForm({
            title: c.title || "",
            slug: c.slug || "",
            description: c.description || "",
            short_description: c.short_description || "",
            instructor_id: c.instructors?.id || "",
            category_id: c.categories?.id || "",
            level: c.level || "Beginner",
            price: String(c.price ?? 0),
            duration_minutes: String(c.duration_minutes ?? 0),
            status: c.status || "draft",
          });
          setCurrentThumb(c.thumbnail_path || null);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v, ...(k === "title" && !f.slugTouched ? { slug: slugify(v) } : {}) }));
  };

  const submit = async (e, andLessons = false) => {
    e?.preventDefault();
    setError("");
    setFieldErrors({});
    setBusy(true);
    try {
      const courseId = await saveCourse({ id: isEdit ? id : null, input: form, thumbnailFile: thumbFile, removeThumbnail: removeThumb });
      push(isEdit ? "Course saved." : "Course created. Now add lessons.");
      navigate(andLessons || !isEdit ? `/admin/courses/${courseId}/lessons` : "/admin/courses");
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      setError(err.message);
      push(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner label={isEdit ? "Loading course…" : "Loading…"} />;

  return (
    <div>
      {stack}
      <div className="flex items-center gap-3">
        <Link to="/admin/courses" className="text-[13px] font-bold text-gray-500 hover:text-black">← Courses</Link>
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight mt-1">{isEdit ? "Edit course" : "New course"}</h1>

      {error && <p className="mt-4 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}

      <form onSubmit={(e) => submit(e, false)} className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Title *" error={fieldErrors.title}>
            <TextInput value={form.title} onChange={set("title")} placeholder="Complete Web Development Bootcamp" />
          </Field>
          <Field label="Slug *" error={fieldErrors.slug} hint="Used in the website URL: /course/your-slug">
            <TextInput value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value, slugTouched: true }))} placeholder="web-dev-bootcamp" />
          </Field>
        </div>

        <Field label="Short description" hint="One line shown on course cards.">
          <TextInput value={form.short_description} onChange={set("short_description")} placeholder="Build modern websites from scratch." maxLength={160} />
        </Field>

        <Field label="Full description">
          <Textarea value={form.description} onChange={set("description")} placeholder="What students will learn, prerequisites, outcomes…" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Category">
            <Select value={form.category_id} onChange={set("category_id")}>
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Instructor">
            <Select value={form.instructor_id} onChange={set("instructor_id")}>
              <option value="">— No instructor —</option>
              {instructors.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <Field label="Level" error={fieldErrors.level}>
            <Select value={form.level} onChange={set("level")}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          </Field>
          <Field label="Price (₹) *" error={fieldErrors.price}>
            <TextInput type="number" min="0" step="1" value={form.price} onChange={set("price")} />
          </Field>
          <Field label="Duration (min) *" error={fieldErrors.duration_minutes}>
            <TextInput type="number" min="0" step="1" value={form.duration_minutes} onChange={set("duration_minutes")} />
          </Field>
          <Field label="Status" error={fieldErrors.status}>
            <Select value={form.status} onChange={set("status")}>
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">{s[0].toUpperCase() + s.slice(1)}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Thumbnail" hint="Image under 5 MB. Stored publicly so the website can show it.">
          {(currentThumb && !removeThumb && !thumbFile) && (
            <img src={thumbnailPublicUrl(currentThumb)} alt="" className="w-40 h-24 object-cover rounded-xl mb-2" />
          )}
          {thumbFile && <p className="text-[12px] text-gray-600 mb-2">Selected: {thumbFile.name}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setThumbFile(e.target.files?.[0] || null);
                setRemoveThumb(false);
              }}
              className="text-sm text-gray-600"
            />
            {(currentThumb || thumbFile) && (
              <button
                type="button"
                onClick={() => {
                  setThumbFile(null);
                  setRemoveThumb(true);
                }}
                className="text-[12px] font-bold text-red-600 hover:underline"
              >
                Remove thumbnail
              </button>
            )}
          </div>
        </Field>

        <div className="flex flex-wrap gap-3 pt-2">
          <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving…" : isEdit ? "Save changes" : "Create course"}</PrimaryButton>
          <GhostButton type="button" disabled={busy} onClick={(e) => submit(e, true)}>
            {isEdit ? "Save & manage lessons" : "Create & add lessons"}
          </GhostButton>
          {isEdit && (
            <Link to={`/admin/courses/${id}/lessons`} className="text-[13px] font-bold px-6 py-2.5 self-center hover:underline">
              Manage lessons →
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
