const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `Request failed: ${res.status}`);
    error.code = data.code;
    error.status = res.status;
    throw error;
  }
  return data;
};

export const api = {
  // Auth
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // Payment
  createCheckout: () => request('/payment/create-checkout-session', { method: 'POST' }),
  createPortal: () => request('/payment/create-portal-session', { method: 'POST' }),
  subscriptionStatus: () => request('/payment/subscription-status'),

  // Upload
  upload: (formData) => {
    const token = getToken();
    return fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    }).then(async r => {
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Upload failed');
      return d;
    });
  },

  // Process
  reprocess: (id) => request(`/process/${id}`, { method: 'POST' }),
  processStatus: (id) => request(`/process/${id}/status`),

  // Email
  sendEmail: (id, email) => request(`/email/send/${id}`, { method: 'POST', body: JSON.stringify({ email }) }),

  // History
  history: (page = 1) => request(`/history?page=${page}`),
  getStudyPack: (id) => request(`/history/${id}`),
  deleteStudyPack: (id) => request(`/history/${id}`, { method: 'DELETE' })
};
