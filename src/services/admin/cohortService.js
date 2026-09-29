const API_BASE = "http://localhost/linux/backend/api/admin/cohorts.php";

/* ================= GET ADMIN ID ================= */

const getAdminId = (clerkId) => {
  const id =
    clerkId ||
    localStorage.getItem("admin_clerk_id") ||
    localStorage.getItem("clerkId");

  if (!id) {
    throw new Error("Admin not authenticated");
  }

  return id;
};

/* ================= SAFE JSON PARSER ================= */

const parseJSON = async (res) => {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON response from server:");
    console.error(text);
    throw new Error("Server returned invalid response");
  }
};

/* ================= LIST COHORTS ================= */

export const listCohorts = async (clerkId) => {
  const id = getAdminId(clerkId);

  const res = await fetch(`${API_BASE}?clerk_id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Clerk-Id": id
    }
  });

  const data = await parseJSON(res);

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch cohorts");
  }

  return data.data || [];
};

/* ================= CREATE COHORT ================= */

export const createCohort = async (payload, clerkId) => {
  const id = getAdminId(clerkId);

  const res = await fetch(`${API_BASE}?clerk_id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Clerk-Id": id
    },
    body: JSON.stringify({
      action: "create",
      ...payload
    })
  });

  const data = await parseJSON(res);

  if (!data.success) {
    throw new Error(data.message || "Failed to create cohort");
  }

  return data;
};

/* ================= UPDATE COHORT ================= */

export const updateCohort = async (payload, clerkId) => {
  const id = getAdminId(clerkId);

  const res = await fetch(`${API_BASE}?clerk_id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Clerk-Id": id
    },
    body: JSON.stringify({
      action: "update",
      ...payload
    })
  });

  const data = await parseJSON(res);

  if (!data.success) {
    throw new Error(data.message || "Failed to update cohort");
  }

  return data;
};

/* ================= DELETE COHORT ================= */

export const deleteCohort = async (cohortId, clerkId) => {
  const id = getAdminId(clerkId);

  const res = await fetch(`${API_BASE}?clerk_id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Clerk-Id": id
    },
    body: JSON.stringify({
      action: "delete",
      id: cohortId
    })
  });

  const data = await parseJSON(res);

  if (!data.success) {
    throw new Error(data.message || "Failed to delete cohort");
  }

  return data;
};