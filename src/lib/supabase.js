import { createClient } from "@supabase/supabase-js";

// Single shared Supabase client for the whole app (student site + admin).
// Returns null when env vars are missing so every caller degrades
// gracefully to offline/demo behavior instead of crashing.

// Vite only inlines VITE_* vars from real .env files (never .env.example,
// which Vite ignores). Names below are the single canonical pair used
// across the whole codebase — do not introduce alternates.

function normalizeUrl(raw) {
  let url = String(raw || "").trim().replace(/\/+$/, "");
  // supabase-js appends /auth/v1, /rest/v1, /storage/v1 itself, so a
  // project URL copied with a /rest/v1 suffix must be stripped back
  // to the bare project URL or every endpoint breaks.
  url = url.replace(/\/rest\/v1$/i, "");
  return url;
}

const url = normalizeUrl(import.meta.env.VITE_SUPABASE_URL);
const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

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
