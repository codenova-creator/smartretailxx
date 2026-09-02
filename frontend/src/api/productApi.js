import apiClient from './apiClient';
import cloudEngine from './cloudEngine';

export const productApi = {
  /**
   * Retrieve all products with optional filtering.
   * Endpoint: GET /api/v1/products?category=...&search=...
   */
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/api/v1/products', { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.info('Using SmartRetailX Cloud Engine for Products:', err.friendlyMessage || err.message);
    }
    return await cloudEngine.getProducts(params);
  },

  /**
   * Retrieve a single product by ID.
   * Endpoint: GET /api/v1/products/{id}
   */
  async getProductById(id) {
    try {
      const response = await apiClient.get(`/api/v1/products/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine for product ID ${id}`);
    }
    return await cloudEngine.getProductById(id);
  },

  /**
   * Create a new product catalog item (Admin / Demo).
   * Endpoint: POST /api/v1/products
   */
  async createProduct(productData) {
    try {
      const response = await apiClient.post('/api/v1/products', productData);
      if (response.data) return response.data;
    } catch (err) {
      console.info('Using Cloud Engine to create product');
    }
    return await cloudEngine.createProduct(productData);
  },

  /**
   * Update an existing product.
   * Endpoint: PUT /api/v1/products/{id}
   */
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/api/v1/products/${id}`, productData);
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine to update product ${id}`);
    }
    return await cloudEngine.updateProduct(id, productData);
  },

  /**
   * Delete a product.
   * Endpoint: DELETE /api/v1/products/{id}
   */
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/api/v1/products/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      console.info(`Using Cloud Engine to delete product ${id}`);
    }
    return await cloudEngine.deleteProduct(id);
  }
};

export default productApi;
