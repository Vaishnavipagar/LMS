import { supabase, requireSupabase, isSupabaseConfigured } from "../../lib/supabase";

// All admin data operations (single place — no duplicate clients).
// Every write is additionally enforced by Row Level Security, so these
// calls fail loudly for non-admins even if the UI guard is bypassed.

export const STATUSES = ["draft", "published", "archived"];
export const LEVELS = ["Beginner", "Intermediate", "Advanced", "All levels"];

// ---------- auth / role ----------

export async function adminSignIn(email, password) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const role = await fetchRole(data.user.id);
  if (role !== "admin") {
    await client.auth.signOut();
    const err = new Error("This account does not have admin access.");
    err.code = "NOT_ADMIN";
    throw err;
  }
  return data.user;
}

export async function adminSignOut() {
  const client = supabase();
  if (client) await client.auth.signOut();
}

export async function fetchRole(uid) {
  if (!uid || !isSupabaseConfigured()) return null;
  const { data, error } = await supabase().from("profiles").select("role").eq("id", uid).maybeSingle();
  if (error) throw error;
  return data?.role || null;
}

export async function currentAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase().auth.getSession();
  const user = data?.session?.user || null;
  if (!user) return null;
  try {
    const role = await fetchRole(user.id);
    return role === "admin" ? user : null;
  } catch {
    return null;
  }
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

// ---------- dashboard ----------

export async function adminStats() {
  const client = requireSupabase();
  const [courses, students, enrollments, payments, recentEnrollments, recentCourses] = await Promise.all([
    client.from("courses").select("id,status", { count: "exact" }),
    client.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    client.from("enrollments").select("id", { count: "exact", head: true }),
    client.from("payments").select("amount").eq("status", "completed"),
    client
      .from("enrollments")
      .select("id, enrolled_at, status, profiles!enrollments_student_id_fkey ( email ), courses ( title )")
      .order("enrolled_at", { ascending: false })
      .limit(6),
    client.from("courses").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(5),
  ]);
  if (courses.error) throw courses.error;
  const published = (courses.data || []).filter((c) => c.status === "published").length;
  const revenue = (payments.data || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  return {
    totalCourses: courses.count || 0,
    publishedCourses: published,
    totalStudents: students.count || 0,
    totalEnrollments: enrollments.count || 0,
    revenue,
    recentEnrollments: recentEnrollments.data || [],
    recentCourses: recentCourses.data || [],
  };
}

// ---------- courses ----------

const COURSE_DETAIL = `
  id, title, slug, description, short_description, thumbnail_path,
  level, price, duration_minutes, status, created_at, updated_at,
  categories ( id, name ), instructors ( id, name )
`;

export async function listCoursesAdmin(search = "") {
  const client = requireSupabase();
  let q = client.from("courses").select(`${COURSE_DETAIL}, lessons ( id )`).order("updated_at", { ascending: false });
  if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map((c) => ({ ...c, lesson_count: (c.lessons || []).length }));
}

export async function getCourseAdmin(id) {
  const client = requireSupabase();
  const { data, error } = await client.from("courses").select(COURSE_DETAIL).eq("id", id).single();
  if (error) throw error;
  return data;
}

export function validateCourse(input) {
  const errors = {};
  if (!input.title?.trim()) errors.title = "Title is required.";
  const slug = (input.slug || "").trim() || slugify(input.title);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.slug = "Slug may only contain lowercase letters, numbers and dashes.";
  if (input.price === "" || input.price == null || Number.isNaN(Number(input.price)) || Number(input.price) < 0)
    errors.price = "Price must be 0 or more.";
  if (input.duration_minutes === "" || Number.isNaN(Number(input.duration_minutes)) || Number(input.duration_minutes) < 0)
    errors.duration_minutes = "Duration must be 0 or more minutes.";
  if (!STATUSES.includes(input.status)) errors.status = "Invalid status.";
  if (!LEVELS.includes(input.level)) errors.level = "Invalid level.";
  return { errors, slug };
}

export async function saveCourse({ id, input, thumbnailFile, removeThumbnail }) {
  const client = requireSupabase();
  const { errors, slug } = validateCourse(input);
  if (Object.keys(errors).length) {
    const err = new Error("Please fix the highlighted fields.");
    err.fields = errors;
    throw err;
  }
  const payload = {
    title: input.title.trim(),
    slug,
    description: input.description?.trim() || null,
    short_description: input.short_description?.trim() || null,
    instructor_id: input.instructor_id || null,
    category_id: input.category_id || null,
    level: input.level,
    price: Number(input.price) || 0,
    duration_minutes: Number(input.duration_minutes) || 0,
    status: input.status,
  };

  let courseId = id;
  if (id) {
    const { error } = await client.from("courses").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await client.from("courses").insert(payload).select("id").single();
    if (error) throw error;
    courseId = data.id;
  }

  // Thumbnail handling (public bucket).
  if (removeThumbnail) {
    const { data: cur } = await client.from("courses").select("thumbnail_path").eq("id", courseId).single();
    if (cur?.thumbnail_path) {
      await client.storage.from("course-thumbnails").remove([cur.thumbnail_path]);
      await client.from("courses").update({ thumbnail_path: null }).eq("id", courseId);
    }
  }
  if (thumbnailFile) {
    if (!thumbnailFile.type.startsWith("image/")) throw new Error("Thumbnail must be an image file.");
    if (thumbnailFile.size > 5 * 1024 * 1024) throw new Error("Thumbnail must be under 5 MB.");
    const ext = (thumbnailFile.name.split(".").pop() || "jpg").toLowerCase();
    const path = `thumbnails/${courseId}/${Date.now()}.${ext}`;
    const { error: upErr } = await client.storage.from("course-thumbnails").upload(path, thumbnailFile, { upsert: false });
    if (upErr) throw new Error(`Thumbnail upload failed: ${upErr.message}`);
    const { error: dbErr } = await client.from("courses").update({ thumbnail_path: path }).eq("id", courseId);
    if (dbErr) throw dbErr;
  }
  return courseId;
}

export async function setCourseStatus(id, status) {
  if (!STATUSES.includes(status)) throw new Error("Invalid status.");
  const { error } = await requireSupabase().from("courses").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteCourse(id) {
  const client = requireSupabase();
  // Best-effort storage cleanup (thumbnails/videos/notes), then the row
  // (lessons + resources cascade via FK).
  try {
    const { data: course } = await client.from("courses").select("thumbnail_path").eq("id", id).single();
    if (course?.thumbnail_path) await client.storage.from("course-thumbnails").remove([course.thumbnail_path]);
    const { data: lessons } = await client.from("lessons").select("video_path").eq("course_id", id);
    const videos = (lessons || []).map((l) => l.video_path).filter(Boolean);
    if (videos.length) await client.storage.from("course-videos").remove(videos);
    const { data: resources } = await client.from("resources").select("file_path").eq("course_id", id);
    const files = (resources || []).map((r) => r.file_path).filter(Boolean);
    if (files.length) await client.storage.from("course-notes").remove(files);
  } catch {
    /* storage cleanup is best-effort; the row delete below still runs */
  }
  const { error } = await client.from("courses").delete().eq("id", id);
  if (error) throw error;
}

// ---------- categories / instructors ----------

export async function listCategories() {
  const { data, error } = await requireSupabase().from("categories").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function saveCategory({ id, name, slug, description }) {
  const client = requireSupabase();
  if (!name?.trim()) throw new Error("Category name is required.");
  const payload = { name: name.trim(), slug: (slug || "").trim() || slugify(name), description: description?.trim() || null };
  if (id) {
    const { error } = await client.from("categories").update(payload).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await client.from("categories").insert(payload).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function deleteCategory(id) {
  const { error } = await requireSupabase().from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function listInstructors() {
  const { data, error } = await requireSupabase().from("instructors").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function saveInstructor({ id, name, title, bio }) {
  const client = requireSupabase();
  if (!name?.trim()) throw new Error("Instructor name is required.");
  const payload = { name: name.trim(), title: title?.trim() || null, bio: bio?.trim() || null };
  if (id) {
    const { error } = await client.from("instructors").update(payload).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await client.from("instructors").insert(payload).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function deleteInstructor(id) {
  const { error } = await requireSupabase().from("instructors").delete().eq("id", id);
  if (error) throw error;
}

// ---------- lessons ----------

export async function listLessonsAdmin(courseId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("lessons")
    .select("id, title, description, position, duration_minutes, video_path, is_published, created_at, resources ( id )")
    .eq("course_id", courseId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data || []).map((l) => ({ ...l, resource_count: (l.resources || []).length }));
}

export function validateLesson(input) {
  const errors = {};
  if (!input.title?.trim()) errors.title = "Lesson title is required.";
  if (input.position === "" || Number.isNaN(Number(input.position)) || Number(input.position) < 0)
    errors.position = "Order must be 0 or more.";
  if (input.duration_minutes === "" || Number.isNaN(Number(input.duration_minutes)) || Number(input.duration_minutes) < 0)
    errors.duration_minutes = "Duration must be 0 or more minutes.";
  return errors;
}

export async function saveLesson({ courseId, id, input, videoFile, removeVideo, onProgress }) {
  const client = requireSupabase();
  const errors = validateLesson(input);
  if (Object.keys(errors).length) {
    const err = new Error("Please fix the highlighted fields.");
    err.fields = errors;
    throw err;
  }
  const payload = {
    course_id: courseId,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    position: Number(input.position) || 0,
    duration_minutes: Number(input.duration_minutes) || 0,
    is_published: !!input.is_published,
  };
  let lessonId = id;
  if (id) {
    const { error } = await client.from("lessons").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await client.from("lessons").insert(payload).select("id").single();
    if (error) throw error;
    lessonId = data.id;
  }

  if (removeVideo) {
    const { data: cur } = await client.from("lessons").select("video_path").eq("id", lessonId).single();
    if (cur?.video_path) {
      await client.storage.from("course-videos").remove([cur.video_path]);
      await client.from("lessons").update({ video_path: null }).eq("id", lessonId);
    }
  }
  if (videoFile) {
    if (!videoFile.type.startsWith("video/")) throw new Error("Lesson file must be a video.");
    if (videoFile.size > 500 * 1024 * 1024) throw new Error("Video must be under 500 MB.");
    const ext = (videoFile.name.split(".").pop() || "mp4").toLowerCase();
    const path = `videos/${courseId}/${lessonId}/${Date.now()}.${ext}`;
    const { error: upErr } = await client.storage.from("course-videos").upload(path, videoFile, {
      upsert: false,
      contentType: videoFile.type,
    });
    if (upErr) throw new Error(`Video upload failed: ${upErr.message}`);
    const { error: dbErr } = await client.from("lessons").update({ video_path: path }).eq("id", lessonId);
    if (dbErr) throw dbErr;
    if (onProgress) onProgress(100);
  }
  return lessonId;
}

export async function setLessonPublished(id, isPublished) {
  const { error } = await requireSupabase().from("lessons").update({ is_published: !!isPublished }).eq("id", id);
  if (error) throw error;
}

export async function deleteLesson(id) {
  const client = requireSupabase();
  try {
    const { data: cur } = await client.from("lessons").select("video_path").eq("id", id).single();
    if (cur?.video_path) await client.storage.from("course-videos").remove([cur.video_path]);
    const { data: resources } = await client.from("resources").select("file_path").eq("lesson_id", id);
    const files = (resources || []).map((r) => r.file_path).filter(Boolean);
    if (files.length) await client.storage.from("course-notes").remove(files);
  } catch {
    /* best-effort */
  }
  const { error } = await client.from("lessons").delete().eq("id", id);
  if (error) throw error;
}

// ---------- resources (notes / PDFs) ----------

export async function listResourcesAdmin(courseId, lessonId = null) {
  const client = requireSupabase();
  let q = client.from("resources").select("*").eq("course_id", courseId).order("created_at", { ascending: true });
  q = lessonId ? q.eq("lesson_id", lessonId) : q.is("lesson_id", null);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function uploadResource({ courseId, lessonId, title, file }) {
  const client = requireSupabase();
  if (!title?.trim()) throw new Error("A title is required for the note/resource.");
  if (!file) throw new Error("Choose a file to upload.");
  if (file.size > 100 * 1024 * 1024) throw new Error("File must be under 100 MB.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `notes/${courseId}/${lessonId || "course"}/${Date.now()}-${safeName}`;
  const { error: upErr } = await client.storage.from("course-notes").upload(path, file, { upsert: false });
  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);
  const { data, error: dbErr } = await client
    .from("resources")
    .insert({
      course_id: courseId,
      lesson_id: lessonId || null,
      title: title.trim(),
      file_path: path,
      file_type: file.type || null,
      file_size: file.size || null,
      is_published: true,
    })
    .select()
    .single();
  if (dbErr) throw dbErr;
  return data;
}

export async function deleteResource(id) {
  const client = requireSupabase();
  try {
    const { data: cur } = await client.from("resources").select("file_path").eq("id", id).single();
    if (cur?.file_path) await client.storage.from("course-notes").remove([cur.file_path]);
  } catch {
    /* best-effort */
  }
  const { error } = await client.from("resources").delete().eq("id", id);
  if (error) throw error;
}

export async function signedFileUrl(bucket, path, expiresIn = 3600) {
  if (!path) return null;
  const { data, error } = await requireSupabase().storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data?.signedUrl || null;
}

// ---------- batches ----------

export async function listBatchesAdmin(courseId = null) {
  const client = requireSupabase();
  let q = client
    .from("batches")
    .select("id, title, starts_at, ends_at, seats, status, created_at, courses ( id, title )")
    .order("starts_at", { ascending: true, nullsFirst: false });
  if (courseId) q = q.eq("course_id", courseId);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function saveBatch({ id, course_id, title, starts_at, ends_at, seats, status }) {
  const client = requireSupabase();
  if (!course_id) throw new Error("Choose a course for this batch.");
  if (!title?.trim()) throw new Error("Batch title is required.");
  if (!["draft", "open", "closed"].includes(status)) throw new Error("Invalid batch status.");
  const payload = {
    course_id,
    title: title.trim(),
    starts_at: starts_at || null,
    ends_at: ends_at || null,
    seats: Math.max(0, Number(seats) || 0),
    status,
  };
  if (id) {
    const { error } = await client.from("batches").update(payload).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await client.from("batches").insert(payload).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function deleteBatch(id) {
  const { error } = await requireSupabase().from("batches").delete().eq("id", id);
  if (error) throw error;
}

// ---------- badges ----------

export async function listBadgesAdmin() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("badges")
    .select("id, name, description, icon, created_at, courses ( id, title ), user_badges ( id )")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((b) => ({ ...b, awarded_count: (b.user_badges || []).length }));
}

export async function saveBadge({ id, name, description, icon, course_id }) {
  const client = requireSupabase();
  if (!name?.trim()) throw new Error("Badge name is required.");
  const payload = {
    name: name.trim(),
    description: description?.trim() || null,
    icon: icon?.trim() || "🏅",
    course_id: course_id || null,
  };
  if (id) {
    const { error } = await client.from("badges").update(payload).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await client.from("badges").insert(payload).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function deleteBadge(id) {
  const { error } = await requireSupabase().from("badges").delete().eq("id", id);
  if (error) throw error;
}

// ---------- certificates ----------

export function newCertificateNo() {
  return `CERT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function listCertificatesAdmin(limit = 100) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("certificates")
    .select("id, certificate_no, student_email, status, issued_at, profiles!certificates_student_id_fkey ( email, first_name, last_name ), courses ( id, title )")
    .order("issued_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function issueCertificate({ student_id, student_email, course_id }) {
  const client = requireSupabase();
  if (!student_id) throw new Error("Choose a student.");
  if (!course_id) throw new Error("Choose a course.");
  const { data: existing } = await client
    .from("certificates")
    .select("id")
    .eq("student_id", student_id)
    .eq("course_id", course_id)
    .maybeSingle();
  if (existing) throw new Error("This student already has a certificate for that course.");
  const { data, error } = await client
    .from("certificates")
    .insert({
      certificate_no: newCertificateNo(),
      student_id,
      student_email: student_email || null,
      course_id,
      status: "issued",
    })
    .select()
    .single();
  if (error) throw error;
  // Award the course-linked badge too, mirroring the auto-award flow.
  try {
    const { data: badge } = await client.from("badges").select("id").eq("course_id", course_id).maybeSingle();
    if (badge) {
      await client.from("user_badges").insert({ student_id, badge_id: badge.id, course_id });
    }
  } catch {
    /* badge award is best-effort */
  }
  return data;
}

export async function revokeCertificate(id) {
  const { error } = await requireSupabase().from("certificates").delete().eq("id", id);
  if (error) throw error;
}

// ---------- payments / course-wise purchases ----------

export async function listPaymentsAdmin(courseId = null, limit = 100) {
  const client = requireSupabase();
  let q = client
    .from("payments")
    .select("id, amount, currency, provider, provider_payment_id, status, created_at, student_email, profiles!payments_student_id_fkey ( email ), courses ( id, title )")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (courseId) q = q.eq("course_id", courseId);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function paymentsSummary(courseId = null) {
  const rows = await listPaymentsAdmin(courseId, 1000);
  const completed = rows.filter((p) => p.status === "completed");
  return {
    count: completed.length,
    revenue: completed.reduce((s, p) => s + (Number(p.amount) || 0), 0),
  };
}

// ---------- students / enrollments (read-mostly) ----------

export async function listStudents(search = "") {
  const client = requireSupabase();
  let q = client
    .from("profiles")
    .select("id, email, first_name, last_name, mobile, role, last_sign_in_at, created_at, enrollments ( id )")
    .order("created_at", { ascending: false })
    .limit(100);
  if (search.trim()) q = q.ilike("email", `%${search.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map((s) => ({ ...s, enrollment_count: (s.enrollments || []).length }));
}

export async function listEnrollmentsAdmin(limit = 50) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("enrollments")
    .select("id, progress, status, enrolled_at, student_email, profiles!enrollments_student_id_fkey ( email, first_name, last_name ), courses ( id, title )")
    .order("enrolled_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function deleteEnrollment(id) {
  const { error } = await requireSupabase().from("enrollments").delete().eq("id", id);
  if (error) throw error;
}
