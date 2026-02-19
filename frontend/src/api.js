import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Ajout automatique du token JWT si présent en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

export const authApi = {
  login: (username, password) => api.post("/auth/login", { username, password }),
  register: (username, password) => api.post("/auth/register", { username, password }),
};

export default api;
