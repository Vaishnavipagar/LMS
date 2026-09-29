// Add this function to adminService.js
const API_BASE = "http://localhost/linux/backend/api";

export const getUserRole = async (email, clerkId = '') => {
  try {
    let url = `${API_BASE}/check_role.php?`;
    if (clerkId) {
      url += `clerk_id=${encodeURIComponent(clerkId)}`;
    } else if (email) {
      url += `email=${encodeURIComponent(email)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Get role error:', error);
    return { success: false, role: 'student' };
  }
};