import apiClient from './apiClient';
import cloudEngine from './cloudEngine';

export const userApi = {
  /**
   * List all registered users (Admin only).
   * Endpoint: GET /api/v1/users
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/api/v1/users');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.info('Using Cloud Engine for users list');
    }
    return await cloudEngine.getAllUsers();
  },

  /**
   * Get user profile by ID.
   * Endpoint: GET /api/v1/users/{id}
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/api/v1/users/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine for user ID ${id}`);
    }
    const users = await cloudEngine.getAllUsers();
    return users.find(u => String(u.id) === String(id)) || null;
  }
};

export default userApi;
