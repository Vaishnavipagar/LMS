const API_BASE = "http://localhost/linux/backend/api/admin";

const getAdminId = (clerkId) => {
    const id = clerkId || 
               localStorage.getItem("admin_clerk_id") || 
               localStorage.getItem("clerkId");
    if (!id) throw new Error("Admin not authenticated");
    return id;
};

export const listEnrollments = async (clerkId, params = {}) => {
    try {
        const id = getAdminId(clerkId);
        const queryParams = new URLSearchParams({
            action: "list",
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || "",
            status: params.status || ""
        }).toString();

        const response = await fetch(`${API_BASE}/admin_enrollments.php?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Clerk-Id": id
            },
            credentials: "include"
        });

        return await response.json();
    } catch (error) {
        console.error("List enrollments error:", error);
        return { success: false, data: [], message: error.message };
    }
};

export const updateEnrollment = async (clerkId, id, data) => {
    try {
        const adminId = getAdminId(clerkId);
        const response = await fetch(`${API_BASE}/admin_enrollments.php?action=update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Clerk-Id": adminId
            },
            body: JSON.stringify({ id, ...data }),
            credentials: "include"
        });

        return await response.json();
    } catch (error) {
        console.error("Update enrollment error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteEnrollment = async (clerkId, enrollmentId) => {
    try {
        const id = getAdminId(clerkId);
        const response = await fetch(`${API_BASE}/admin_enrollments.php?action=delete&id=${enrollmentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Clerk-Id": id
            },
            credentials: "include"
        });

        return await response.json();
    } catch (error) {
        console.error("Delete enrollment error:", error);
        return { success: false, message: error.message };
    }
};

export const getEnrollmentStats = async (clerkId) => {
    try {
        const id = getAdminId(clerkId);
        const response = await fetch(`${API_BASE}/admin_enrollments.php?action=stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Clerk-Id": id
            },
            credentials: "include"
        });

        return await response.json();
    } catch (error) {
        console.error("Get enrollment stats error:", error);
        return { success: false, stats: {} };
    }
};