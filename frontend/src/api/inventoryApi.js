import apiClient from './apiClient';
import cloudEngine from './cloudEngine';

export const inventoryApi = {
  /**
   * Get stock level for a product.
   * Endpoint: GET /api/v1/inventory/{productId}
   */
  async getInventory(productId) {
    try {
      const response = await apiClient.get(`/api/v1/inventory/${productId}`);
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine for inventory ${productId}`);
    }
    return await cloudEngine.getInventory(productId);
  },

  /**
   * Check stock availability for a given quantity.
   * Endpoint: GET /api/v1/inventory/check/{productId}?quantity=1
   */
  async checkStock(productId, quantity = 1) {
    try {
      const response = await apiClient.get(`/api/v1/inventory/check/${productId}`, {
        params: { quantity }
      });
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine to check stock for ${productId}`);
    }
    return await cloudEngine.checkStock(productId, quantity);
  },

  /**
   * Update stock level for a product directly (Admin / Demo).
   * Endpoint: PUT /api/v1/inventory/{productId}
   */
  async updateStock(productId, stock) {
    try {
      const response = await apiClient.put(`/api/v1/inventory/${productId}`, {
        stock: Number(stock)
      });
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine to update stock for ${productId}`);
    }
    return await cloudEngine.updateStock(productId, stock);
  },

  /**
   * Reduce stock upon order completion.
   * Endpoint: POST /api/v1/inventory/reduce
   */
  async reduceStock(productId, quantity) {
    try {
      const response = await apiClient.post('/api/v1/inventory/reduce', {
        productId: String(productId),
        quantity: Number(quantity)
      });
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine to reduce stock for ${productId}`);
    }
    return await cloudEngine.reduceStock(productId, quantity);
  }
};

export default inventoryApi;
