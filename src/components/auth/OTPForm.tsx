
"use client";
import { useState } from "react";

type Props = {
  value?: string;
  onChange?: (otp: string) => void;
  onSubmit?: (otp: string) => Promise<void>;
  submitLabel?: string;
  onResend?: () => Promise<void>;

  wrapperClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export function OTPForm({
  value,
  onChange,
  onSubmit,
  submitLabel = "Verify OTP",
  onResend,
  wrapperClassName = "",
  inputClassName = "",
  buttonClassName = "",
}: Props) {
  const [internalOtp, setInternalOtp] = useState("");

  const otp = value ?? internalOtp;

  const handleChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!value) setInternalOtp(clean);
    onChange?.(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !onSubmit) return;
    await onSubmit(otp);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${wrapperClassName}`}
    >
      <label htmlFor="OTP"> Verify OTP</label>
      <input
        type="text"
        id="OTP"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter 6-digit OTP"
        className={`w-full ui-elevated rounded-lg border border-gray-300 px-4 py-2 text-center
          tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
          ${inputClassName}`}
      />

      {onSubmit && (
        <button
          type="submit"
          disabled={otp.length !== 6}
          className={`w-full rounded-lg bg-blue-600 py-2 font-medium
            hover:bg-blue-700 transition disabled:opacity-60
            ${buttonClassName}`}
        >
          {submitLabel}
        </button>
      )}

      {onResend && (
        <button
          type="button"
          onClick={onResend}
          className="w-full text-sm text-blue-600 hover:underline"
        >
          Resend OTP
        </button>
      )}
    </form>
  );
}
