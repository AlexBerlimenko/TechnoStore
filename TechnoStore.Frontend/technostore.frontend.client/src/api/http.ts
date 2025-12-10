import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7215", // адреса backend
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

// автоматично підставляємо JWT токен, якщо він є
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
