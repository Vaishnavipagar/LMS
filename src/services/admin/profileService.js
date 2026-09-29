const API_BASE = "http://localhost/linux/backend/api";

export const getProfile = async (clerkId, userData = {}) => {
  try {
    const response = await fetch(`${API_BASE}/profile.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clerk_id: clerkId,
        ...userData
      }),
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    return { 
      success: false, 
      message: 'Network error',
      data: null 
    };
  }
};

export const updateProfile = async (clerkId, updates) => {
  try {
    const response = await fetch(`${API_BASE}/profile.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clerk_id: clerkId,
        ...updates
      }),
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    return { 
      success: false, 
      message: 'Network error' 
    };
  }
};