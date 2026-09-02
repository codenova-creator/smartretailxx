import apiClient from './apiClient';
import cloudEngine from './cloudEngine';

export const authApi = {
  /**
   * Authenticate user with email and password.
   * Endpoint: POST /api/v1/auth/login
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/api/v1/auth/login', {
        email: email.trim(),
        password: password
      });
      if (response.data && response.data.token) {
        return response.data;
      }
    } catch (err) {
      console.info('Using Cloud Engine for authentication login fallback');
    }
    return await cloudEngine.login(email, password);
  },

  /**
   * Register a new user profile.
   * Endpoint: POST /api/v1/Users
   */
  async register({ name, email, role = 'Customer', password }) {
    try {
      const response = await apiClient.post('/api/v1/Users', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role,
        password: password || 'Default@123'
      });
      if (response.data) return response.data;
    } catch (err) {
      console.info('Using Cloud Engine for user registration fallback');
    }
    return await cloudEngine.register({ name, email, role, password });
  },

  /**
   * Get current authenticated user profile using Bearer token.
   * Endpoint: GET /api/v1/auth/me
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/v1/auth/me');
      if (response.data) return response.data;
    } catch (err) {
      console.info('Using Cloud Engine for current user profile fallback');
    }
    const token = localStorage.getItem('smartretailx_token');
    return await cloudEngine.getCurrentUser(token);
  }
};

export default authApi;
