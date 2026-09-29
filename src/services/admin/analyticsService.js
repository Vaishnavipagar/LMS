const API_BASE = "http://localhost/linux/backend/api";

export async function getAnalytics(days = 30) {
  try {

    // =============================
    // READ CLERK ID FROM STORAGE
    // =============================
    const clerkId =
      localStorage.getItem("admin_clerk_id") ||
      localStorage.getItem("clerkId") ||
      "";

    const res = await fetch(
      `${API_BASE}/admin/admin_analytics.php?days=${days}&clerk_id=${clerkId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": clerkId
        },
        credentials: "include"
      }
    );

    if (!res.ok) {
      console.error("Analytics API error:", await res.text());
      return { success: false, users_growth: [], enrollments_growth: [] };
    }

    return await res.json();

  } catch (err) {
    console.error("Analytics fetch error:", err);
    return { success: false, users_growth: [], enrollments_growth: [] };
  }
}