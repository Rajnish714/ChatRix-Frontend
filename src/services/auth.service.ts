import { LoginResponse,LoginRequest,User } from "@/types/auth.types";
import api from "@/utils/axios";



export const useAuthService ={
login:async(data:LoginRequest): Promise<LoginResponse>=>{
 const res = await api.post("/auth/login", data);
 return res.data;
},


 getMe:async(): Promise<User>=>{
 const res = await api.get("/auth/me");
 return res.data;
}
}