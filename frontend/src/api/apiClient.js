import axios from 'axios';

// In development, use relative URL ('') so Vite proxy intercepts requests and prevents CORS/OPTIONS 405 errors.
// In production behind ALB, relative URL ('') also routes directly to the ALB.
// If an explicit external URL is provided in VITE_API_BASE_URL, use that.
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = (rawBaseUrl && rawBaseUrl.trim() !== '') ? rawBaseUrl.replace(/\/+$/, '') : '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Request Interceptor: Attach JWT Bearer Token if present
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('smartretailx_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize Error Responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected error occurred. Please try again.';
    const status = error.response ? error.response.status : null;
    const data = error.response ? error.response.data : null;

    if (data) {
      if (typeof data === 'string') {
        friendlyMessage = data;
      } else if (data.message) {
        friendlyMessage = data.message;
      } else if (data.title) {
        friendlyMessage = data.title;
      } else if (data.errors && typeof data.errors === 'object') {
        const firstErrorKey = Object.keys(data.errors)[0];
        if (firstErrorKey && Array.isArray(data.errors[firstErrorKey])) {
          friendlyMessage = data.errors[firstErrorKey][0];
        }
      }
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      friendlyMessage = 'Request timed out. Please verify your network or backend availability.';
    } else if (error.code === 'ERR_NETWORK') {
      friendlyMessage = 'Unable to reach the SmartRetailX backend. Please verify your connection or dev proxy.';
    }

    if (status === 401) {
      if (!friendlyMessage || friendlyMessage.includes('unexpected')) {
        friendlyMessage = 'Invalid credentials or your session has expired. Please log in.';
      }
    } else if (status === 403) {
      friendlyMessage = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      if (!data?.message) {
        friendlyMessage = 'The requested resource was not found.';
      }
    } else if (status === 500) {
      if (!data?.message) {
        friendlyMessage = 'Backend service encountered an error. Please try again shortly.';
      }
    }

    // Attach human readable normalized error property
    error.friendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export default apiClient;
export { BASE_URL };
