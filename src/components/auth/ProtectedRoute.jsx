import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetch("http://localhost/linux/backend/api/admin/admin_auth.php", {
      headers: {
        "X-Clerk-Id": user.id
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      })
      .catch(() => setUserRole(null))
      .finally(() => setLoading(false));

  }, [user, isLoaded]);

  // Wait for role check
  if (loading) return <div>Checking access...</div>;

  // Not logged in
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}