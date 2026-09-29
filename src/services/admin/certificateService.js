// src/services/admin/certificateService.js
const API_BASE = "http://localhost/linux/backend/api";

// Admin certificate functions
export const listCertificates = async (clerkId) => {
  try {
    const response = await fetch(`${API_BASE}/admin/admin_certificates.php?action=list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Clerk-Id': clerkId
      },
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('List certificates error:', error);
    return { success: false, data: [], message: 'Network error' };
  }
};

export const approveCertificate = async (clerkId, certificateId) => {
  try {
    const response = await fetch(`${API_BASE}/admin/admin_certificates.php?action=approve&id=${certificateId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Clerk-Id': clerkId
      },
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Approve certificate error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const rejectCertificate = async (clerkId, certificateId, reason = '') => {
  try {
    let url = `${API_BASE}/admin/admin_certificates.php?action=reject&id=${certificateId}`;
    if (reason) {
      url += `&reason=${encodeURIComponent(reason)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Clerk-Id': clerkId
      },
      credentials: 'include'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Reject certificate error:', error);
    return { success: false, message: 'Network error' };
  }
};