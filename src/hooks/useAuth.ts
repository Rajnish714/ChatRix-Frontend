

import { forgotPasswordRequest, LoginRequest,OTPRequest,SignupRequest,resetPasswordRequest } from "@/types/auth.types";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useAuth=()=>{
  const {user,token,setUser,setToken,otpSession,setOTPSession,login,logout}= useAuthStore()
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string | null>(null);
 
  const loginUser=async(data:LoginRequest)=>{
    setError(null)
    setLoading(true)
    try{
    const res= await useAuthService.loginRequest(data)
     login(res.accessToken,res.user)
     
    return res.user
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  }

  const signupUser=async(data:SignupRequest)=>{
    setError(null)
    setLoading(true)
    try{
    const res= await useAuthService.signupRequest(data)
     setOTPSession(res.otpSession)
     
    return res.otpSession
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  }
const verifyOTP = async (otp: string) => {
  if (!otpSession) {
    setError("OTP session expired");
    return null;
  }

  setError(null);
  setLoading(true);

  try {

    const payload: OTPRequest = {
      otp,
      otpSession,
    };

    const res = await useAuthService.verifyOTPRequest(payload);

    setOTPSession(null);
    return res.user; 
  } catch (error) {
    setError(getErrorMessage(error));
    return null;
  } finally {
    setLoading(false);
  }
};

    const resendOTP = async () => {
          if (!otpSession) {
    setError("OTP session expired");
    return null;
  }
     setError(null)
    setLoading(true)
 
    try{
      
    const res= await useAuthService.resendOTPRequest({otpSession})
    setOTPSession(res.otpSession)
     
    return res.otpSession
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  };




    const forgotPassword = async (data:forgotPasswordRequest) => {
      
     setError(null)
    setLoading(true)
 
    try{
      
    const res= await useAuthService.forgotPasswordRequest(data)
    setOTPSession(res.otpSession)
     
    return res.otpSession
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  };


      const resetPassword = async (newPassword:string,otp:string) => {
        if (!otpSession) {
    setError("OTP session expired");
    return null;
  }
     setError(null)
    setLoading(true)
 
    try{
      
    const payload: resetPasswordRequest = {
      otp,
      otpSession,
      newPassword,
    };
    const res= await useAuthService.resetPasswordRequest(payload)
      
    return res.message
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  };

      const logoutUser = async () => {
       
     setError(null)
    setLoading(true)
 
    try{
      
  
    const res= await useAuthService.logoutRequest()
    logout()
     
    return res.message
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  };


  return {
    user,
    token,
    isLoading,
    isError,
    loginUser,
     logoutUser,
    signupUser,
    verifyOTP,
    resendOTP,
    resetPassword,
    forgotPassword,
    setOTPSession,
    otpSession,
    
  }
}