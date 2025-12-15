import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

 const api= axios.create({
  baseURL:process.env.NEXT_PUBLIC_API_URL,
  withCredentials:true
}
)

api.interceptors.request.use((config)=>{
const token= useAuthStore.getState().token;
if(token){
  config.headers.Authorization=`Bearer ${token}`
}
return config
})
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // 🔴 STOP HERE if refresh itself failed
    if (original?.url?.includes("/auth/refresh-token")) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
    

      try {
        const refreshResp = await api.post("/auth/refresh-token");
        const newToken = refreshResp.data.accessToken;

        useAuthStore.getState().setToken(newToken);
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