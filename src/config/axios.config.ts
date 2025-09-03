import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Sempre enviar cookies
});

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    console.info(error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.data?.mensagem) {
      toast.error(error.response.data.mensagem);
    } else {
      toast.error("Ocorreu um erro inesperado.");
    }
    return Promise.reject(error);
  }
);

export default api;
