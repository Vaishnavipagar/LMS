import { createClient } from "@supabase/supabase-js";

// Single shared Supabase client for the whole app (student site + admin).
// Returns null when env vars are missing so every caller degrades
// gracefully to offline/demo behavior instead of crashing.

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

export function supabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

export function requireSupabase() {
  const c = supabase();
  if (!c) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
  return c;
}
