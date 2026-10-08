import { supabase, isSupabaseConfigured } from "./supabase";

// Student email+password auth (Supabase Auth). When Supabase is not
// configured every helper degrades gracefully so pages fall back to
// the offline demo login instead of crashing.

export function studentAuthAvailable() {
  return isSupabaseConfigured();
}

export async function studentSignUp(email, password) {
  const { data, error } = await supabase().auth.signUp({ email, password });
  if (error) throw error;
  // profiles row is auto-created by the handle_new_user trigger.
  return data.user;
}

export async function studentSignIn(email, password) {
  const { data, error } = await supabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function studentSignOut() {
  const client = supabase();
  if (client) await client.auth.signOut();
}

export async function currentStudent() {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase().auth.getSession();
  return data?.session?.user || null;
}

export function onStudentAuthChange(cb) {
  if (!isSupabaseConfigured()) return () => {};
  const { data: sub } = supabase().auth.onAuthStateChange((_e, session) => cb(session?.user || null));
  return () => sub?.subscription?.unsubscribe();
}
