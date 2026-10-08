import { supabase, isSupabaseConfigured } from "./supabase";

// Public catalog reads (published courses only — enforced by RLS).
// Every function returns null when Supabase is off or on error, so the
// student site keeps its static/offline content as a fallback.

const COURSE_SELECT = `
  id, title, slug, description, short_description, thumbnail_path,
  level, price, duration_minutes, status, created_at,
  categories ( id, name, slug ),
  instructors ( id, name, title )
`;

export async function listPublishedCourses() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase()
      .from("courses")
      .select(COURSE_SELECT)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Attach lesson + enrollment counts (best-effort, non-fatal).
    const withCounts = await Promise.all(
      (data || []).map(async (c) => {
        try {
          const client = supabase();
          const [{ count: lessons }] = await client
            .from("lessons")
            .select("id", { count: "exact", head: true })
            .eq("course_id", c.id)
            .eq("is_published", true);
          const [{ count: students }] = await client
            .from("enrollments")
            .select("id", { count: "exact", head: true })
            .eq("course_id", c.id);
          return { ...c, lesson_count: lessons || 0, student_count: students || 0 };
        } catch {
          return { ...c, lesson_count: 0, student_count: 0 };
        }
      })
    );
    return withCounts;
  } catch {
    return null;
  }
}

// Fetch one published course by slug (preferred) or uuid, with its
// published lessons + resources. Returns null when not found/offline.
export async function getPublishedCourse(idOrSlug) {
  if (!isSupabaseConfigured()) return null;
  try {
    const client = supabase();
    const isUuid = /^[0-9a-f-]{36}$/i.test(String(idOrSlug || ""));
    let query = client.from("courses").select(COURSE_SELECT).eq("status", "published");
    query = isUuid ? query.eq("id", idOrSlug) : query.eq("slug", idOrSlug);
    const { data: course, error } = await query.maybeSingle();
    if (error || !course) return null;

    const { data: lessons } = await client
      .from("lessons")
      .select("id, title, description, position, duration_minutes, video_path, is_published")
      .eq("course_id", course.id)
      .eq("is_published", true)
      .order("position", { ascending: true });
    const { data: resources } = await client
      .from("resources")
      .select("id, lesson_id, title, file_path, file_type, file_size")
      .eq("course_id", course.id)
      .eq("is_published", true)
      .order("created_at", { ascending: true });
    return { ...course, lessons: lessons || [], resources: resources || [] };
  } catch {
    return null;
  }
}

export function thumbnailUrl(path) {
  if (!path) return null;
  try {
    const { data } = supabase().storage.from("course-thumbnails").getPublicUrl(path);
    return data?.publicUrl || null;
  } catch {
    return null;
  }
}

// Signed URLs for PRIVATE video/notes files. RLS on storage.objects only
// grants enrolled students + admins, so these fail for anyone else.
export async function signedVideoUrl(path, expiresIn = 3600) {
  if (!path || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase().storage.from("course-videos").createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

export async function signedNoteUrl(path, expiresIn = 3600) {
  if (!path || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase().storage.from("course-notes").createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

export function formatPrice(amount) {
  const n = Number(amount);
  if (!n) return "Free";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `₹${n}`;
  }
}

export function formatDuration(minutes) {
  const m = Number(minutes) || 0;
  if (m <= 0) return "";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

// Alias kept for older imports (Dashboard).
export const priceLabel = formatPrice;
