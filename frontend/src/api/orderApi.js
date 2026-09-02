import apiClient from './apiClient';
import cloudEngine from './cloudEngine';

export const orderApi = {
  /**
   * Place and create a new order.
   * Endpoint: POST /api/v1/orders
   * @param {Object} orderData { userId, customerName, customerEmail, items: [{ productId, productName, quantity, unitPrice }] }
   */
  async createOrder(orderData) {
    let result = null;
    try {
      const response = await apiClient.post('/api/v1/orders', orderData);
      if (response.data?.id) {
        result = response.data;
      }
    } catch (err) {
      console.info('Using Cloud Engine for Order Creation fallback');
    }

    if (!result) {
      result = await cloudEngine.createOrder(orderData);
    }
    
    // Store order ID in localStorage for user session tracking
    try {
      const existing = JSON.parse(localStorage.getItem('smartretailx_user_orders') || '[]');
      if (result?.id && !existing.includes(result.id)) {
        existing.unshift(result.id);
        localStorage.setItem('smartretailx_user_orders', JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('Failed to cache order ID', e);
    }

    return result;
  },

  /**
   * Retrieve order details by ID.
   * Endpoint: GET /api/v1/orders/{id}
   */
  async getOrderById(id) {
    try {
      const response = await apiClient.get(`/api/v1/orders/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine for order ID ${id}`);
    }
    return await cloudEngine.getOrderById(id);
  },

  /**
   * Retrieve all orders for a specific user.
   */
  async getUserOrders(userId) {
    try {
      const response = await apiClient.get(`/api/v1/orders/user/${userId}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.info('Using Cloud Engine for user orders fallback');
    }
    return await cloudEngine.getUserOrders(userId);
  },

  /**
   * Update an order's status (e.g. 'Processing', 'Shipped', 'Delivered', 'Cancelled')
   * Endpoint: PUT /api/v1/orders/{id}/status
   */
  async updateOrderStatus(id, status) {
    try {
      const response = await apiClient.put(`/api/v1/orders/${id}/status`, { status });
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine to update order ${id} status to ${status}`);
    }
    return await cloudEngine.updateOrderStatus(id, status);
  },

  /**
   * Retrieve all platform orders (Admin view).
   * Endpoint: GET /api/v1/orders
   */
  async getAllOrders() {
    try {
      const response = await apiClient.get('/api/v1/orders');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.info('Using Cloud Engine for all orders (Admin view)');
    }
    return await cloudEngine.getAllOrders();
  }
};

export default orderApi;
