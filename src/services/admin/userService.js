const API_BASE = "http://localhost/linux/backend/api";

/* ===== GET ADMIN ID SAFELY ===== */

const getAdminId = (clerkId) => {
  const id =
    clerkId ||
    localStorage.getItem("admin_clerk_id") ||
    localStorage.getItem("clerkId");

  if (!id) {
    console.error("Admin Clerk ID not found");
  }

  return id;
};


/* =====================================================
   LIST USERS
===================================================== */

export const listUsers = async (clerkId) => {
  try {

    const id = getAdminId(clerkId);

    if (!id) {
      return { success: false, data: [], message: "Admin not authenticated" };
    }

    const response = await fetch(
      `${API_BASE}/admin/admin_users.php?action=list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": id
        },
        credentials: "include"
      }
    );

    const data = await response.json();

    if (!data?.success) {
      console.error("Users API error:", data?.message);
      return { success: false, data: [], message: data?.message };
    }

    return data;

  } catch (error) {

    console.error("List users error:", error);

    return {
      success: false,
      data: [],
      message: "Network error"
    };

  }
};


/* =====================================================
   DELETE USER
===================================================== */

export const deleteUser = async (clerkId, userId) => {
  try {

    const id = getAdminId(clerkId);

    if (!id) {
      return { success: false, message: "Admin not authenticated" };
    }

    const response = await fetch(
      `${API_BASE}/admin/admin_users.php?action=delete&id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": id
        },
        credentials: "include"
      }
    );

    return await response.json();

  } catch (error) {

    console.error("Delete user error:", error);

    return {
      success: false,
      message: "Network error"
    };

  }
};


/* =====================================================
   CHANGE ROLE
===================================================== */

export const changeRole = async (clerkId, userId, role) => {
  try {

    const id = getAdminId(clerkId);

    if (!id) {
      return { success: false, message: "Admin not authenticated" };
    }

    const response = await fetch(
      `${API_BASE}/admin/admin_users.php?action=role`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": id
        },
        body: JSON.stringify({ id: userId, role }),
        credentials: "include"
      }
    );

    return await response.json();

  } catch (error) {

    console.error("Change role error:", error);

    return {
      success: false,
      message: "Network error"
    };

  }
};