import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { currentStudent, studentSignOut } from "../lib/auth";
import { myEnrollments, thumbnailPublicUrl } from "../lib/enrollmentsApi";
import { myBadges, myCertificates } from "../lib/progressApi";
import { priceLabel } from "../lib/coursesApi";
import { GradCapIcon } from "../components/icons";

function avatarUrl(path) {
  if (!path) return null;
  try {
    const { data } = supabase().storage.from("avatars").getPublicUrl(path);
    return data?.publicUrl || null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rows, setRows] = useState(null);
  const [badges, setBadges] = useState([]);
  const [certs, setCerts] = useState([]);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pForm, setPForm] = useState({ first_name: "", last_name: "", mobile: "" });
  const [pAvatar, setPAvatar] = useState(null);
  const [pSaving, setPSaving] = useState(false);
  const [pMsg, setPMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isSupabaseConfigured()) {
        // Offline demo: dashboard mirrors the browser enrollments.
        const demoUser = localStorage.getItem("learnaxis_user");
        if (!demoUser) {
          navigate("/login", { replace: true });
          return;
        }
        if (!cancelled) {
          setUser(JSON.parse(demoUser));
          setRows("demo");
          setReady(true);
        }
        return;
      }
      const u = await currentStudent();
      if (cancelled) return;
      if (!u) {
        navigate("/login", { replace: true });
        return;
      }
      setUser(u);
      const [list, b, c, prof] = await Promise.all([
        myEnrollments(),
        myBadges(),
        myCertificates(),
        supabase().from("profiles").select("first_name, last_name, mobile, avatar_path").eq("id", u.id).maybeSingle(),
      ]);
      if (!cancelled) {
        setRows(list || []);
        setBadges(b || []);
        setCerts(c || []);
        setProfile(prof?.data || prof || null);
        if (prof?.data || prof) {
          const p = prof.data || prof;
          setPForm({ first_name: p.first_name || "", last_name: p.last_name || "", mobile: p.mobile || "" });
        }
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const logout = async () => {
    await studentSignOut();
    localStorage.removeItem("learnaxis_user");
    navigate("/login");
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setPMsg("");
    if (!pForm.first_name.trim() || !pForm.last_name.trim()) {
      setPMsg("First name and surname are required.");
      return;
    }
    if (!/^[+\d][\d\s-]{6,17}$/.test(pForm.mobile.trim())) {
      setPMsg("Please enter a valid mobile number.");
      return;
    }
    if (pAvatar) {
      if (!pAvatar.type.startsWith("image/")) {
        setPMsg("Profile picture must be an image file.");
        return;
      }
      if (pAvatar.size > 2 * 1024 * 1024) {
        setPMsg("Profile picture must be under 2 MB.");
        return;
      }
    }
    setPSaving(true);
    try {
      let avatar_path = profile?.avatar_path || null;
      if (pAvatar && user) {
        const ext = (pAvatar.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase().storage.from("avatars").upload(path, pAvatar, { upsert: true });
        if (upErr) throw new Error(`Picture upload failed: ${upErr.message}`);
        avatar_path = path;
      }
      const { error } = await supabase()
        .from("profiles")
        .update({
          first_name: pForm.first_name.trim(),
          last_name: pForm.last_name.trim(),
          mobile: pForm.mobile.trim(),
          ...(avatar_path ? { avatar_path } : {}),
        })
        .eq("id", user.id);
      if (error) throw error;
      setProfile((p) => ({ ...(p || {}), first_name: pForm.first_name.trim(), last_name: pForm.last_name.trim(), mobile: pForm.mobile.trim(), avatar_path }));
      setPAvatar(null);
      setEditing(false);
      setPMsg("Profile updated.");
    } catch (err) {
      setPMsg(err.message);
    } finally {
      setPSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm font-semibold text-gray-500">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#191817] pt-24 pb-10">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">My learning</h1>
            <p className="text-white/60 text-[13px] mt-2">{user?.email || "Student dashboard"}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/courses")}
              className="rounded-full bg-[#F5820B] text-white text-[13px] font-bold px-5 py-2.5 hover:bg-[#E06F00] transition"
            >
              Browse courses
            </button>
            <button
              onClick={logout}
              className="rounded-full border border-white/25 text-white/80 text-[13px] font-bold px-5 py-2.5 hover:border-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#F6F0E6] min-h-[50vh]">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12">
          {profile && (
            <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-8">
              <div className="flex flex-wrap items-center gap-4">
                {avatarUrl(profile.avatar_path) ? (
                  <img src={avatarUrl(profile.avatar_path)} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                ) : (
                  <span className="w-16 h-16 rounded-full bg-[#191817] text-white grid place-items-center text-xl font-extrabold">
                    {(profile.first_name?.[0] || user?.email?.[0] || "?").toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-[16px]">
                    {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Student"}
                  </p>
                  <p className="text-[12px] text-gray-500 break-all">{user?.email}</p>
                  {profile.mobile && <p className="text-[12px] text-gray-500">{profile.mobile}</p>}
                </div>
                <button
                  onClick={() => {
                    setEditing(!editing);
                    setPMsg("");
                  }}
                  className="rounded-full border border-gray-300 bg-white text-[12px] font-bold px-4 py-2 hover:border-black transition"
                >
                  {editing ? "Close" : "Edit profile"}
                </button>
              </div>
              {editing && (
                <form onSubmit={saveProfile} className="grid sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <input value={pForm.first_name} onChange={(e) => setPForm({ ...pForm, first_name: e.target.value })} placeholder="First name" className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#F5820B]" />
                  <input value={pForm.last_name} onChange={(e) => setPForm({ ...pForm, last_name: e.target.value })} placeholder="Surname" className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#F5820B]" />
                  <input value={pForm.mobile} onChange={(e) => setPForm({ ...pForm, mobile: e.target.value })} placeholder="Mobile number" inputMode="tel" className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#F5820B]" />
                  <input type="file" accept="image/*" onChange={(e) => setPAvatar(e.target.files?.[0] || null)} className="text-sm self-center" />
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button disabled={pSaving} className="rounded-full bg-[#191817] text-white text-[13px] font-bold px-6 py-2.5 hover:bg-black transition disabled:opacity-50">
                      {pSaving ? "Saving…" : "Save profile"}
                    </button>
                    {pMsg && <p className="text-[12px] font-semibold text-gray-600">{pMsg}</p>}
                  </div>
                </form>
              )}
              {!editing && pMsg && <p className="text-[12px] font-semibold text-gray-600 mt-3">{pMsg}</p>}
            </div>
          )}
          {rows === "demo" && (
            <p className="text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl px-5 py-4">
              Demo mode — browse <button onClick={() => navigate("/courses")} className="font-bold underline">courses</button> and
              enroll to see them here. Connect Supabase for real accounts with video access.
            </p>
          )}
          {Array.isArray(rows) && rows.length === 0 && (
            <div className="rounded-2xl bg-white border border-dashed border-gray-300 px-6 py-12 text-center">
              <p className="font-bold text-[#191817]">No courses yet</p>
              <p className="text-[13px] text-gray-500 mt-1.5">Enroll in a course and it will appear here with videos and notes.</p>
              <button
                onClick={() => navigate("/courses")}
                className="mt-5 rounded-full bg-[#F5820B] text-white text-[13px] font-bold px-6 py-2.5 hover:bg-[#E06F00] transition"
              >
                Find a course
              </button>
            </div>
          )}
          {Array.isArray(rows) && rows.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map((e) => {
                const c = e.courses || {};
                const slug = c.slug || e.course_id;
                return (
                  <article key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-xl transition">
                    <div className="h-44 overflow-hidden">
                      <img
                        src={thumbnailPublicUrl(c.thumbnail_path) || `https://picsum.photos/seed/${encodeURIComponent(slug)}/640/360`}
                        alt={c.title}
                        loading="lazy"
                        className="block w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] text-gray-500 font-semibold">
                        {c.categories?.name || "Course"} • {c.instructors?.name || "LearnLoop Team"}
                      </p>
                      <h3 className="font-bold text-[14px] leading-snug mt-1.5 min-h-[40px]">{c.title}</h3>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#F5820B]" style={{ width: `${e.progress || 0}%` }} />
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium mt-1.5">{e.progress || 0}% complete</p>
                      </div>
                      <button
                        onClick={() => navigate(`/course/${slug}`)}
                        className="mt-4 w-full rounded-full bg-[#191817] text-white text-[13px] font-bold py-2.5 hover:bg-black transition"
                      >
                        Continue learning
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {Array.isArray(rows) && rows.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
              <div className="rounded-2xl bg-white border border-gray-200 p-5">
                <h2 className="text-[15px] font-extrabold tracking-tight">My badges</h2>
                {badges.length === 0 ? (
                  <p className="text-[13px] text-gray-500 mt-2">Complete a course to earn your first badge.</p>
                ) : (
                  <ul className="mt-3 space-y-2.5">
                    {badges.map((b) => (
                      <li key={b.id} className="flex items-center gap-3 rounded-xl bg-[#F6F0E6] px-3.5 py-2.5">
                        {b.badges?.icon ? (
                          <span className="text-2xl">{b.badges.icon}</span>
                        ) : (
                          <span className="w-9 h-9 rounded-full bg-[#191817] text-[#F5820B] grid place-items-center shrink-0">
                            <GradCapIcon size={16} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold truncate">{b.badges?.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {b.courses?.title || b.badges?.description || ""}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl bg-white border border-gray-200 p-5">
                <h2 className="text-[15px] font-extrabold tracking-tight">My certificates</h2>
                {certs.length === 0 ? (
                  <p className="text-[13px] text-gray-500 mt-2">Finish a course to receive a certificate here.</p>
                ) : (
                  <ul className="mt-3 space-y-2.5">
                    {certs.map((c) => (
                      <li key={c.id} className="rounded-xl border border-gray-200 px-3.5 py-2.5">
                        <p className="text-[13px] font-bold">{c.courses?.title || "Course"}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                          {c.certificate_no} • {c.issued_at ? new Date(c.issued_at).toLocaleDateString() : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
