// plataformaEntrenamiento/utils/apiClient.js
import axios from "axios";
import { API_BASE_URL } from "../config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Para añadir token automáticamente en cada request (si tienes token guardado)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o donde guardes el token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
