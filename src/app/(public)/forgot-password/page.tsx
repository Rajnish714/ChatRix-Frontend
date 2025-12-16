"use client";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OTPForm } from "@/components/auth/OTPForm";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/stores/alert.store";

export default function ForgotPasswordPage(){
   const router= useRouter()
 const [otp, setOtp] = useState("");
 const {    forgotPassword,
    resetPassword,
    resendOTP,
    otpSession,
    isLoading,
    isError,}=useAuth()

    const {show}=useAlertStore()



     const [newPassword, setNewPassword] = useState("");

  const handleSendOtp = async (email: string) => {
    await forgotPassword({ email });
  };

  const handleResetPassword = async () => {
    const success = await resetPassword(newPassword,otp);
  if (success) {
    show("Password reset successfully. Redirecting to login…", "success");

    setTimeout(() => {
      router.replace("/login");
    }, 1500);
  } else {
    show("Invalid OTP or password reset failed", "error");
  }
  };

    const handleResend = async () => {
    const success=await resendOTP();
      if(success)
    show("Otp resend.", "success");
  };

   
  return (
    <div>
      {!otpSession && (
        <ForgotPasswordForm
          onSubmit={handleSendOtp}
          isLoading={isLoading}
          error={isError}
        />
      )}

      {otpSession && (
        <>
        
          <OTPForm
             value={otp}
             onChange={setOtp}
            onResend={handleResend}
              wrapperClassName="mt-4"
             inputClassName="bg-white"
            buttonClassName="mt-2"
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
          />

          <button
            onClick={handleResetPassword}
            disabled={!otp || !newPassword }
             className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium
                     hover:bg-blue-700 transition disabled:opacity-60"
          >
            Reset Password
          </button>
        
        </>
      )}
    </div>
  );
}