// AdminApp.jsx
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import AdminSidebar from "./AdminSidebar";

import { checkAdmin } from "../../services/admin/authService"; // ✅ Only admin check needed
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

export default function AdminApp() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [adminAccess, setAdminAccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // Not logged in → redirect
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    let isMounted = true;

    const verifyAdmin = async () => {
      try {
        const clerkId = user?.id;

        if (!clerkId) {
          throw new Error("Invalid user session");
        }

        // ✅ Only check admin access
        const adminResult = await checkAdmin(clerkId);

        if (!isMounted) return;

        if (adminResult?.success && adminResult?.isAdmin === true) {
          setAdminAccess(true);
        } else {
          setError("Access denied. Admin privileges required.");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Admin verification error:", err);
        setError(err.message || "Admin verification failed");
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [user, isLoaded, isSignedIn, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* ---------- LOADING ---------- */
  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
        <LoadingSpinner message="Loading admin panel..." />
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center p-4">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  /* ---------- ACCESS DENIED ---------- */
  if (!adminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400 mb-6">
            You don't have permission to access this area.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  /* ---------- ADMIN DASHBOARD ---------- */
  return (
    <div className="h-screen bg-gray-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? "260px" : "80px" }}
      >
        <main className="flex-1 overflow-auto">
          <AdminDashboard user={user} onLogout={handleLogout} />
        </main>
      </div>
    </div>
  );
}