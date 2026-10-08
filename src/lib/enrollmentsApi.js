import { supabase, isSupabaseConfigured } from "./supabase";

// Enrollment reads for logged-in students. Null = Supabase off / error,
// in which case pages keep their offline (localStorage) behavior.

export async function myEnrollments() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: session } = await supabase().auth.getSession();
    const uid = session?.session?.user?.id;
    if (!uid) return null;
    const { data, error } = await supabase()
      .from("enrollments")
      .select("id, course_id, progress, status, enrolled_at, courses ( id, title, slug, short_description, thumbnail_path, price, duration_minutes, categories ( name ), instructors ( name ) )")
      .eq("student_id", uid)
      .order("enrolled_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return null;
  }
}

export async function isEnrolledIn(courseDbId) {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: session } = await supabase().auth.getSession();
    const uid = session?.session?.user?.id;
    if (!uid) return false;
    const { data, error } = await supabase()
      .from("enrollments")
      .select("id")
      .eq("student_id", uid)
      .eq("course_id", courseDbId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  } catch {
    return null;
  }
}

export function thumbnailPublicUrl(path) {
  if (!path) return null;
  try {
    const { data } = supabase().storage.from("course-thumbnails").getPublicUrl(path);
    return data?.publicUrl || null;
  } catch {
    return null;
  }
}
