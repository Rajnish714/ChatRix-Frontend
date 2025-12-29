import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

 
    if (original?.url?.includes("/auth/refresh-token")) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = api
          .post("/auth/refresh-token")
          .then((res) => {
            const newToken = res.data.accessToken;
            useAuthStore.getState().setToken(newToken);
            return newToken;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      try {
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
