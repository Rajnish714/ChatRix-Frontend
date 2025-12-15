"use client";

import { OTPForm } from "@/components/auth/OTPForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function OTPPage(){
    const router= useRouter()
    const {otpSession,verifyOTP,resendOTP,isError,isLoading}=useAuth()
     if (!otpSession) {
    router.replace("/signup");
    return null;
  }

async function handleVerifyOtp(otp:string){
    const success = await verifyOTP(otp);
      if (success) {
      router.replace("/login");
    }
}
  const handleResend = async () => {
    await resendOTP();
  };

    return(
          <div>
      <h1>Verify OTP</h1>

      {isError && <p style={{ color: "red" }}>{isError}</p>}

      <OTPForm
        onSubmit={handleVerifyOtp}
        onResend={handleResend}
      />

      {isLoading && <p>Processing...</p>}
    </div>
   
   )
}