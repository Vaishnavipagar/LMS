import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_COPY as C } from "../data/auth";
import { studentAuthAvailable, studentSignIn, studentSignUp } from "../lib/auth";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("login"); // login | signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const live = studentAuthAvailable();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a 4+ character password.");
      return;
    }
    // Real Supabase Auth when configured; otherwise the offline demo login.
    if (live) {
      setError("");
      setNotice("");
      if (mode === "signup") {
        if (!firstName.trim() || !lastName.trim()) {
          setError("Please enter your first name and surname.");
          return;
        }
        if (!/^[+\d][\d\s-]{6,17}$/.test(mobile.trim())) {
          setError("Please enter a valid mobile number.");
          return;
        }
        if (avatarFile) {
          if (!avatarFile.type.startsWith("image/")) {
            setError("Profile picture must be an image file.");
            return;
          }
          if (avatarFile.size > 2 * 1024 * 1024) {
            setError("Profile picture must be under 2 MB.");
            return;
          }
        }
      }
      setBusy(true);
      try {
        let uid = null;
        if (mode === "signup") {
          const user = await studentSignUp(email.trim(), password);
          uid = user?.id || null;
          if (!uid) {
            const { data: session } = await supabase().auth.getSession();
            uid = session?.session?.user?.id || null;
          }
          if (!uid) {
            // Email confirmation is enabled: no session yet, so profile
            // fields and avatar cannot be saved (RLS). Ask the user to
            // confirm email first, then log in. Picture can be added
            // later from the dashboard profile editor.
            setNotice("Account created. Please confirm your email, then log in below.");
            setMode("login");
            setAvatarFile(null);
            return;
          }
          if (uid) {
            let avatar_path = null;
            if (avatarFile) {
              const ext = (avatarFile.name.split(".").pop() || "jpg").toLowerCase();
              const path = `${uid}/avatar-${Date.now()}.${ext}`;
              const { error: upErr } = await supabase().storage.from("avatars").upload(path, avatarFile, { upsert: true });
              if (upErr) throw new Error(`Account created, but picture upload failed: ${upErr.message}`);
              avatar_path = path;
            }
            await supabase()
              .from("profiles")
              .update({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                mobile: mobile.trim(),
                ...(avatar_path ? { avatar_path } : {}),
              })
              .eq("id", uid);
          }
        } else {
          await studentSignIn(email.trim(), password);
        }
        try {
          const { data: session } = await supabase().auth.getSession();
          const uid = session?.session?.user?.id;
          if (uid) {
            await supabase().from("profiles").update({ last_sign_in_at: new Date().toISOString() }).eq("id", uid);
          }
        } catch {
          /* login timestamp is best-effort */
        }
        localStorage.setItem("learnaxis_user", JSON.stringify({ email }));
        navigate("/dashboard");
      } catch (err) {
        setError(err.message || "Authentication failed.");
      } finally {
        setBusy(false);
      }
      return;
    }
    localStorage.setItem("learnaxis_user", JSON.stringify({ email }));
    navigate("/courses");
  };

  const demo = () => {
    localStorage.setItem("learnaxis_user", JSON.stringify({ email: "demo@learnloop.com" }));
    navigate("/courses");
  };

  return (
    <div className="min-h-screen bg-[#F6F0E6] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-[24px] overflow-hidden shadow-2xl">
        <div className="bg-[#191817] p-8 sm:p-10 text-white flex flex-col justify-between gap-8">
          <button onClick={() => navigate("/")} className="font-extrabold text-lg text-left">
            {C.brand}
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {C.panelTitleLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </h2>
            <p className="text-white/60 text-[13px] mt-4 leading-relaxed">{C.panelDesc}</p>
            <div className="flex gap-6 mt-7">
              {C.panelStats.map(([n, l]) => (
                <div key={l}>
                  <div className="text-[#F5820B] font-extrabold">{n}</div>
                  <div className="text-white/50 text-[11px]">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-[11px]">
            New here? <Link to="/courses" className="text-[#F5820B] font-bold">Browse courses first</Link>
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <h1 className="text-xl font-extrabold tracking-tight text-[#191817]">{C.formTitle}</h1>
          <p className="text-[12px] text-gray-500 mt-1.5">{C.formDesc}</p>

          {error && (
            <p className="mt-4 text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}
          {notice && (
            <p className="mt-4 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{notice}</p>
          )}

          <form onSubmit={submit}>
            <label className="block text-[12px] font-bold mt-6 text-[#191817]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
            />

            <label className="block text-[12px] font-bold mt-4 text-[#191817]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
            />

            {live && mode === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold mt-4 text-[#191817]">First name</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Aarav"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mt-4 text-[#191817]">Surname</label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Sharma"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
                    />
                  </div>
                </div>
                <label className="block text-[12px] font-bold mt-4 text-[#191817]">Mobile number</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  inputMode="tel"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F5820B] focus:ring-2 focus:ring-[#F5820B]/20"
                />
                <label className="block text-[12px] font-bold mt-4 text-[#191817]">
                  Profile picture <span className="font-medium text-gray-400">(optional, max 2 MB)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="mt-2 w-full text-sm text-gray-600"
                />
                {avatarFile && <p className="text-[12px] text-gray-500 mt-1">Selected: {avatarFile.name}</p>}
              </>
            )}

            <button disabled={busy} className="mt-6 w-full rounded-full bg-[#191817] text-white font-bold py-3.5 text-sm hover:bg-black transition disabled:opacity-50">
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Login"}
            </button>
          </form>
          {live && (
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signup" ? "login" : "signup");
                setError("");
                setNotice("");
              }}
              className="mt-3 w-full text-[13px] font-bold text-gray-600 hover:text-black transition"
            >
              {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
            </button>
          )}
          {!live && (
            <button
              onClick={demo}
              className="mt-3 w-full rounded-full bg-[#F5820B] text-white font-extrabold py-3.5 text-sm hover:bg-[#E06F00] transition"
            >
              Continue as demo student
            </button>
          )}

          <p className="text-[12px] text-gray-500 mt-5 text-center">
            Frontend demo only — any valid-looking email works.
          </p>
        </div>
      </div>
    </div>
  );
}
