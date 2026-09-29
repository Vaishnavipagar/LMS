const API_BASE = "http://localhost/linux/backend/api/admin";

const getAdminId = (clerkId) => {
    const id =
        clerkId ||
        localStorage.getItem("admin_clerk_id") ||
        localStorage.getItem("clerkId");

    if (!id) throw new Error("Admin not authenticated");

    return id;
};

export const listPayments = async (clerkId, params = {}) => {
    try {

        const id = getAdminId(clerkId);

        const queryParams = new URLSearchParams({
            action: "list",
            page: params.page || 1,
            limit: params.limit || 10
        }).toString();

        const response = await fetch(
            `${API_BASE}/admin_payments.php?${queryParams}`,
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
            console.error("Payments API error:", data?.message);
        }

        return data;

    } catch (error) {

        console.error("List payments error:", error);

        return {
            success: false,
            data: [],
            revenue: {}
        };

    }
};

export const addPayment = async (clerkId, paymentData) => {
    try {

        const id = getAdminId(clerkId);

        const response = await fetch(
            `${API_BASE}/admin_payments.php?action=add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Clerk-Id": id
                },
                body: JSON.stringify(paymentData),
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!data?.success) {
            console.error("Add payment API error:", data?.message);
        }

        return data;

    } catch (error) {

        console.error("Add payment error:", error);

        return {
            success: false,
            message: error.message
        };

    }
};