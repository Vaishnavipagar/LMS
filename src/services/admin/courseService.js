const API_BASE = "http://localhost/linux/backend/api/admin";

const getAdminId = (clerkId) => {

  const id =
    clerkId ||
    localStorage.getItem("admin_clerk_id") ||
    localStorage.getItem("clerkId");

  if (!id)
    throw new Error("Admin not authenticated");

  return id;
};

/* LIST COURSES */

export const listCourses = async (clerkId, params = {}) => {

  try {

    const id = getAdminId(clerkId);

    const query = new URLSearchParams({
      action: "list",
      ...params
    }).toString();

    const response = await fetch(
      `${API_BASE}/admin_courses.php?${query}`,
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

    console.error("List courses error:", error);

    return {
      success: false,
      data: [],
      message: error.message
    };
  }
};

/* ADD COURSE */

export const addCourse = async (clerkId, course) => {

  try {

    const id = getAdminId(clerkId);

    const formData = new FormData();

    Object.keys(course).forEach(key => {
      formData.append(key, course[key] ?? "");
    });

    const response = await fetch(
      `${API_BASE}/admin_courses.php?action=add`,
      {
        method: "POST",
        headers: {
          "X-Clerk-Id": id
        },
        credentials: "include",
        body: formData
      }
    );

    return await response.json();

  } catch (error) {

    console.error("Add course error:", error);

    return {
      success: false,
      message: error.message
    };
  }
};

/* UPDATE COURSE */

export const updateCourse = async (clerkId, course) => {

  try {

    const id = getAdminId(clerkId);

    const response = await fetch(
      `${API_BASE}/admin_courses.php?action=update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Clerk-Id": id
        },
        credentials: "include",
        body: JSON.stringify(course)
      }
    );

    return await response.json();

  } catch (error) {

    console.error("Update course error:", error);

    return {
      success: false,
      message: error.message
    };
  }
};

/* DELETE COURSE */

export const deleteCourse = async (clerkId, courseId) => {

  try {

    const id = getAdminId(clerkId);

    const response = await fetch(
      `${API_BASE}/admin_courses.php?action=delete&id=${courseId}`,
      {
        method: "POST",
        headers: {
          "X-Clerk-Id": id
        },
        credentials: "include"
      }
    );

    return await response.json();

  } catch (error) {

    console.error("Delete course error:", error);

    return {
      success: false,
      message: error.message
    };
  }
};