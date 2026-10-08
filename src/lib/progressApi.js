import { supabase, isSupabaseConfigured } from "./supabase";

// Progress tracking + automatic badge/certificate awards.
// A lesson counts as complete once its row exists in lesson_progress.
// Course progress = completed lessons / published lessons.

// All lesson ids the student finished in a course.
export async function completedLessonIds(studentId, courseDbId) {
  const { data, error } = await supabase()
    .from("lesson_progress")
    .select("lesson_id")
    .eq("student_id", studentId)
    .eq("course_id", courseDbId);
  if (error) throw error;
  return new Set((data || []).map((r) => r.lesson_id));
}

export async function markLessonComplete({ studentId, courseDbId, lessonId, totalLessons }) {
  const client = supabase();
  await client.from("lesson_progress").upsert(
    { student_id: studentId, course_id: courseDbId, lesson_id: lessonId },
    { onConflict: "student_id,lesson_id" }
  );
  const done = await completedLessonIds(studentId, courseDbId);
  const pct = totalLessons > 0 ? Math.min(100, Math.round((done.size / totalLessons) * 100)) : 0;
  await client
    .from("enrollments")
    .update({ progress: pct, status: pct >= 100 ? "completed" : "active" })
    .eq("student_id", studentId)
    .eq("course_id", courseDbId);
  return { done, pct };
}

// Awards the course badge (if the admin linked one) and the certificate
// when progress hits 100%. Idempotent — unique constraints + pre-checks
// make repeats safe. Returns what was newly awarded.
export async function awardOnCompletion({ studentId, studentEmail, courseDbId, courseTitle }) {
  const client = supabase();
  const awarded = { badge: null, certificate: null };

  const { data: existingCert } = await client
    .from("certificates")
    .select("id")
    .eq("student_id", studentId)
    .eq("course_id", courseDbId)
    .eq("status", "issued")
    .maybeSingle();

  const { data: badge } = await client
    .from("badges")
    .select("id, name")
    .eq("course_id", courseDbId)
    .maybeSingle();
  if (badge) {
    const { data: has } = await client
      .from("user_badges")
      .select("id")
      .eq("student_id", studentId)
      .eq("badge_id", badge.id)
      .maybeSingle();
    if (!has) {
      const { error } = await client.from("user_badges").insert({
        student_id: studentId,
        badge_id: badge.id,
        course_id: courseDbId,
      });
      if (!error) awarded.badge = badge;
    }
  }

  if (!existingCert) {
    const no = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const { data, error } = await client
      .from("certificates")
      .insert({
        certificate_no: no,
        student_id: studentId,
        student_email: studentEmail || null,
        course_id: courseDbId,
        status: "issued",
      })
      .select()
      .single();
    if (!error) awarded.certificate = { ...data, courseTitle };
  }
  return awarded;
}

export async function myBadges() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: session } = await supabase().auth.getSession();
    const uid = session?.session?.user?.id;
    if (!uid) return [];
    const { data, error } = await supabase()
      .from("user_badges")
      .select("id, awarded_at, badges ( name, description, icon ), courses ( title )")
      .eq("student_id", uid)
      .order("awarded_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return null;
  }
}

export async function myCertificates() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: session } = await supabase().auth.getSession();
    const uid = session?.session?.user?.id;
    if (!uid) return [];
    const { data, error } = await supabase()
      .from("certificates")
      .select("id, certificate_no, status, issued_at, courses ( title )")
      .eq("student_id", uid)
      .eq("status", "issued")
      .order("issued_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return null;
  }
}
