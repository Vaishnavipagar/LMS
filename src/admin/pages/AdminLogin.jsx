import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isSupabaseConfigured } from "../../lib/supabase";
import { adminSignIn } from "../lib/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    location.state?.reason === "role"
      ? "That account is not an admin. Only admin accounts can enter the panel."
      : ""
  );
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@") || !password) {
      setError("Enter your admin email and password.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await adminSignIn(email.trim(), password);
      navigate(location.state?.from && location.state.from !== "/admin/login" ? location.state.from : "/admin", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191817] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-md bg-white rounded-[24px] p-8 sm:p-10 shadow-2xl">
        <p className="font-extrabold text-lg tracking-tight text-[#191817]">
          LearnLoop <span className="text-[#F5820B]">Admin</span>
        </p>
        <h1 className="text-xl font-extrabold tracking-tight text-[#191817] mt-4">Admin login</h1>
        <p className="text-[12px] text-gray-500 mt-1.5">
          Restricted area. Only accounts with the admin role can sign in here — students use the main login page.
        </p>

        {!configured && (
          <p className="mt-4 text-[12px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env (see .env.example).
          </p>
        )}
        {error && (
          <p className="mt-4 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <form onSubmit={submit}>
          <label className="block text-[12px] font-bold mt-6 text-[#191817]">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
          />
          <label className="block text-[12px] font-bold mt-4 text-[#191817]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
          />
          <button
            disabled={busy || !configured}
            className="mt-6 w-full rounded-full bg-[#191817] text-white font-bold py-3.5 text-sm hover:bg-black transition disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in to Admin Panel"}
          </button>
        </form>

        <p className="text-[12px] text-gray-500 mt-5 text-center">
          <Link to="/" className="font-bold text-black hover:underline">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
