const API_BASE = import.meta.env.VITE_API_BASE;

export const getStats = async (days = 30, clerkId) => {

  try {

    if (!clerkId) {
      return {
        success: false,
        message: "Missing Clerk ID"
      };
    }

    const response = await fetch(
      `${API_BASE}/admin/admin_stats.php?days=${days}&clerk_id=${clerkId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": clerkId
        },
        credentials: "include"
      }
    );

    /* ================= HTTP ERROR CHECK ================= */

    if (!response.ok) {

      return {
        success: false,
        message: `Server error (${response.status})`
      };

    }

    const data = await response.json();

    /* ================= RESPONSE VALIDATION ================= */

    if (!data || typeof data !== "object") {

      return {
        success: false,
        message: "Invalid API response"
      };

    }

    return data;

  } catch (error) {

    console.error("Stats fetch error:", error);

    return {
      success: false,
      message: error.message || "Network error"
    };

  }

};