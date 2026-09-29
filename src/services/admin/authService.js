const API_BASE = "http://localhost/linux/backend/api";

// =====================================================
// CHECK ADMIN
// =====================================================
export const checkAdmin = async (clerkId) => {
  try {
    const response = await fetch(
      `${API_BASE}/auth/get_user_role.php`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": clerkId,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success === true,
      role: data.role || "student",
      isAdmin: data.role === "admin", // derive from role
      clerkId: clerkId,
      message: data.message || "",
    };

  } catch (error) {
    console.error("Admin check error:", error);

    return {
      success: false,
      isAdmin: false,
      role: "student",
      message: error.message || "Network error",
    };
  }
};

// =====================================================
// VERIFY ADMIN
// =====================================================
export const verifyAdmin = async (clerkId) => {
  try {
    const response = await fetch(
      `${API_BASE}/auth/get_user_role.php`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": clerkId,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success === true,
      message: data.message || "",
      isAdmin: data.role === "admin",
      role: data.role || "student",
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Network error",
      isAdmin: false,
      role: "student",
    };
  }
};

// =====================================================
// GET USER ROLE (MAIN FUNCTION FOR LOGIN FLOW)
// =====================================================
export const getUserRole = async (clerkId) => {
  try {
    const response = await fetch(
      `${API_BASE}/auth/get_user_role.php`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": clerkId,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success === true,
      role: data.role || "student",
      isAdmin: data.role === "admin",
      clerkId: clerkId,
    };

  } catch (error) {
    console.error("Get role error:", error);

    return {
      success: false,
      role: "student",
      isAdmin: false,
    };
  }
};
