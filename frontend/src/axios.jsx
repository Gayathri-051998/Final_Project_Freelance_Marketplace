// src/axios.jsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : "/api",
});

// (optional) add JWT if stored
api.interceptors.request.use(c => {
  const t = localStorage.getItem("token"); if (t) c.headers.Authorization = `Bearer ${t}`; return c;
});

export default api;
