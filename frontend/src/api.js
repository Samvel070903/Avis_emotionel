import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const productsApi = {
  list: () => api.get("/products"),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const reviewsApi = {
  list: (productId) => api.get(`/products/${productId}/reviews`),
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
};

export const statsApi = {
  get: (productId) => api.get(`/products/${productId}/stats`),
  recommendations: (productId) => api.get(`/products/${productId}/recommendations`),
};

export default api;
