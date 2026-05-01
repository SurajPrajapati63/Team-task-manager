import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "team-task-manager-production-989c.up.railway.app"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("teamTaskToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("teamTaskToken");
      localStorage.removeItem("teamTaskUser");
    }
    return Promise.reject(error);
  }
);

export default api;
