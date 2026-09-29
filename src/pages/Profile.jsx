import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

// ---- ONLY ADDED SECTION ----
const syncProfile = async (user) => {
  await fetch("http://localhost/backend/api/profile.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerk_id: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress?.emailAddress,
    }),
  });
};
// ---- END ADDED SECTION ----

export default function Profile() {
  const { user } = useUser();

  // ---- ONLY ADDED LINE ----
  useEffect(() => {
    if (user) syncProfile(user);
  }, [user]);
  // ------------------------

  return (
    <div className="pt-28 px-6 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
          My Profile
        </h1>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow">
          <div className="flex items-center gap-6 mb-8">
            <img
              src={user?.imageUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full border object-cover"
            />

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user?.fullName || "User"}
              </h2>
              <p className="text-slate-600 text-sm">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                First Name
              </label>
              <div className="border rounded-lg px-4 py-2 bg-slate-50">
                {user?.firstName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Last Name
              </label>
              <div className="border rounded-lg px-4 py-2 bg-slate-50">
                {user?.lastName}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-600 mb-1">
                Email
              </label>
              <div className="border rounded-lg px-4 py-2 bg-slate-50">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            To edit your profile details, use the account management options from
            the user menu.
          </p>
        </div>
      </div>
    </div>
  );
}
