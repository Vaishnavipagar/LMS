import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminStats } from "../lib/adminApi";
import { isSupabaseConfigured } from "../../lib/supabase";
import { Spinner } from "../components/ui";

function inr(n) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `₹${n || 0}`;
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    adminStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-amber-200">
        <h1 className="text-xl font-extrabold">Connect Supabase to begin</h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file
          (see <code>.env.example</code>), then run the SQL in <code>supabase/migrations/0001_lms_schema.sql</code> in
          your Supabase project. Afterwards this dashboard shows live courses, students, enrollments and revenue.
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <h1 className="text-xl font-extrabold">Could not load dashboard</h1>
        <p className="text-sm text-red-600 mt-2">{error}</p>
        <p className="text-sm text-gray-500 mt-2">Did you run the migration SQL in your Supabase project?</p>
      </div>
    );
  }
  if (!stats) return <Spinner label="Loading dashboard…" />;

  const cards = [
    { label: "Total courses", value: stats.totalCourses, to: "/admin/courses" },
    { label: "Published", value: stats.publishedCourses, to: "/admin/courses" },
    { label: "Students", value: stats.totalStudents, to: "/admin/enrollments" },
    { label: "Enrollments", value: stats.totalEnrollments, to: "/admin/enrollments" },
    { label: "Revenue", value: inr(stats.revenue), to: "/admin/enrollments" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
      <p className="text-[13px] text-gray-500 mt-1">Live overview of your LMS.</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{c.label}</p>
            <p className="text-2xl font-extrabold mt-1.5">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Recent enrollments</h2>
            <Link to="/admin/enrollments" className="text-[12px] font-bold text-[#F5820B] hover:underline">View all</Link>
          </div>
          {stats.recentEnrollments.length === 0 && <p className="text-[13px] text-gray-500 mt-3">No enrollments yet.</p>}
          <ul className="mt-3 space-y-2.5">
            {stats.recentEnrollments.map((e) => (
              <li key={e.id} className="text-[13px] flex justify-between gap-3">
                <span className="truncate">
                  <span className="font-bold">{e.profiles?.email || e.student_email || "Student"}</span>
                  <span className="text-gray-400"> → </span>
                  {e.courses?.title || "Course"}
                </span>
                <span className="text-gray-400 shrink-0">{new Date(e.enrolled_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Recently updated courses</h2>
            <Link to="/admin/courses" className="text-[12px] font-bold text-[#F5820B] hover:underline">Manage</Link>
          </div>
          {stats.recentCourses.length === 0 && (
            <p className="text-[13px] text-gray-500 mt-3">
              No courses yet. <Link to="/admin/courses/new" className="font-bold text-[#F5820B] hover:underline">Create your first course</Link>.
            </p>
          )}
          <ul className="mt-3 space-y-2.5">
            {stats.recentCourses.map((c) => (
              <li key={c.id} className="text-[13px] flex justify-between gap-3">
                <Link to={`/admin/courses/${c.id}/lessons`} className="font-bold truncate hover:underline">{c.title}</Link>
                <span className="text-gray-400 shrink-0 capitalize">{c.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
