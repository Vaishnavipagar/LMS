import React, { useEffect } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../services/admin/authService";

export default function Login() {

  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  // ================= ROLE CHECK + REDIRECT =================
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const handleLogin = async () => {
      try {
        const clerkId = user.id;

        console.log("Clerk ID:", clerkId);

        // fetch role from backend
        const result = await getUserRole(clerkId);

        if (!result.success) {
          console.error("Role fetch failed");
          return;
        }

        const role = result.role;

        // store role for later use
        localStorage.setItem("userRole", role);

        console.log("User role:", role);

        // ================= REDIRECT BASED ON ROLE =================
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/student/dashboard");
        }

      } catch (error) {
        console.error("Login error:", error);
      }
    };

    handleLogin();

  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-slate-50 pt-24 pb-10 px-4">
      <div className="w-full max-w-md flex items-center justify-center">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/signup"
          fallbackRedirectUrl="/"   // Clerk will redirect → then our useEffect runs
          appearance={{
            elements: {
              card: "shadow-2xl border border-slate-200 rounded-2xl",
              rootBox: "mx-auto",
              cardBox: "mx-auto",
            },
          }}
        />
      </div>
    </div>
  );
}
