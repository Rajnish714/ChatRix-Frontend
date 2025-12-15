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
  }
  };

    const handleResend = async () => {
    await resendOTP();
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
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
          />

          <button
            onClick={handleResetPassword}
            disabled={!otp || !newPassword }
          >
            Reset Password
          </button>
        
        </>
      )}
    </div>
  );
}