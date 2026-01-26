import { useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="pt-28 px-6 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Welcome, {user?.firstName || "Student"} 👋
        </h1>
        <p className="text-slate-600 mb-10">
          This is your learning dashboard. From here you’ll access your courses,
          progress, and account.
        </p>

        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow">
            <h3 className="font-bold text-slate-900 mb-2">📚 My Courses</h3>
            <p className="text-sm text-slate-600">
              View and continue your enrolled courses.
            </p>
            <button className="mt-4 text-indigo-600 font-semibold text-sm">
              Go to courses →
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow">
            <h3 className="font-bold text-slate-900 mb-2">📈 Progress</h3>
            <p className="text-sm text-slate-600">
              Track your learning progress and achievements.
            </p>
            <button className="mt-4 text-indigo-600 font-semibold text-sm">
              View progress →
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow">
            <h3 className="font-bold text-slate-900 mb-2">⚙️ Account</h3>
            <p className="text-sm text-slate-600">
              Manage your profile and account settings.
            </p>
            <button className="mt-4 text-indigo-600 font-semibold text-sm">
              Open settings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
