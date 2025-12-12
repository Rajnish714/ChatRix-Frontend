

import { LoginRequest } from "@/types/auth.types";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useAuth=()=>{
    const {user,token,isAuthenticated,setUser,setToken,login,logout}= useAuthStore()
     const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string | null>(null);
 
  const loginUser=async(data:LoginRequest)=>{
    setError(null)
    setLoading(true)
    try{
    const res= await useAuthService.login(data)
     login(res.accessToken,res.user)
     
    return res.user
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isError,
    loginUser,
    logout,

  }
}