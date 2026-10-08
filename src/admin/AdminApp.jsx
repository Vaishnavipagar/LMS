import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { fetchRole } from "./lib/adminApi";
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CoursesAdmin from "./pages/CoursesAdmin";
import CourseForm from "./pages/CourseForm";
import CourseLessons from "./pages/CourseLessons";
import CategoriesAdmin from "./pages/CategoriesAdmin";
import InstructorsAdmin from "./pages/InstructorsAdmin";
import EnrollmentsAdmin from "./pages/EnrollmentsAdmin";
import BatchesAdmin from "./pages/BatchesAdmin";
import BadgesAdmin from "./pages/BadgesAdmin";
import CertificatesAdmin from "./pages/CertificatesAdmin";
import PaymentsAdmin from "./pages/PaymentsAdmin";
import { Spinner } from "./components/ui";

// Everything under /admin (except /admin/login) requires a logged-in
// user whose profiles.role === 'admin'. Anyone else is signed out and
// sent back to the admin login page.
function AdminRoute({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ phase: "checking", email: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isSupabaseConfigured()) {
        if (alive) setState({ phase: "denied", email: "", reason: "nodb" });
        return;
      }
      try {
        const { data } = await supabase().auth.getSession();
        const user = data?.session?.user;
        if (!user) {
          if (alive) setState({ phase: "denied", email: "" });
          return;
        }
        const role = await fetchRole(user.id);
        if (role === "admin") {
          if (alive) setState({ phase: "allowed", email: user.email || "" });
        } else {
          await supabase().auth.signOut();
          if (alive) setState({ phase: "denied", email: "", reason: "role" });
        }
      } catch {
        if (alive) setState({ phase: "denied", email: "", reason: "error" });
      }
    })();
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  if (state.phase === "checking") {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
        <Spinner label="Checking admin access…" />
      </div>
    );
  }
  if (state.phase === "denied") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname, reason: state.reason }} />;
  }
  return <AdminLayout userEmail={state.email}>{children}</AdminLayout>;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <AdminRoute>
            <CoursesAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/courses/new"
        element={
          <AdminRoute>
            <CourseForm />
          </AdminRoute>
        }
      />
      <Route
        path="/courses/:id/edit"
        element={
          <AdminRoute>
            <CourseForm />
          </AdminRoute>
        }
      />
      <Route
        path="/courses/:id/lessons"
        element={
          <AdminRoute>
            <CourseLessons />
          </AdminRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <AdminRoute>
            <CategoriesAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/instructors"
        element={
          <AdminRoute>
            <InstructorsAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/enrollments"
        element={
          <AdminRoute>
            <EnrollmentsAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/batches"
        element={
          <AdminRoute>
            <BatchesAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/badges"
        element={
          <AdminRoute>
            <BadgesAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <AdminRoute>
            <CertificatesAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <AdminRoute>
            <PaymentsAdmin />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
