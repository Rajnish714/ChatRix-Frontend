"use client";

import { OTPForm } from "@/components/auth/OTPForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/stores/alert.store";

export default function OTPPage(){
  const {show}= useAlertStore()
    const router= useRouter()
    const {otpSession,verifyOTP,resendOTP,isLoading}=useAuth()
     if (!otpSession) {
    router.replace("/signup");
    return null;
  }

async function handleVerifyOtp(otp:string){
    const success = await verifyOTP(otp);
      if (success) {
         show("User registered successfully.", "success");
      router.replace("/login");
    }else show("something went wrong", "error");
}
  const handleResend = async () => {
    const success=await resendOTP();
    if(success)
    show("Otp sent successfully.", "success");
  else{
      show("something went wrong", "error");
  }
  };

    return(
          <div>
    
          <OTPForm
        onSubmit={handleVerifyOtp}
        onResend={handleResend}
           wrapperClassName="mt-4"
             inputClassName="bg-white"
            buttonClassName="mt-2"
      />

      {isLoading && <p>Processing...</p>}
    </div>
   
   )
}