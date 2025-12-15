"use client";
import { useState } from "react";
type Props = {
  value?: string;
  onChange?: (otp: string) => void;

  onSubmit?: (otp: string) => Promise<void>; 
  submitLabel?: string;
  onResend?: () => Promise<void>;
};
export function OTPForm({
  value,
  onChange,
  onSubmit,
  submitLabel = "Verify OTP",
  onResend,
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter 6-digit OTP"
      />

      {/* Submit button ONLY if onSubmit exists */}
      {onSubmit && (
        <button type="submit" disabled={otp.length !== 6}>
          {submitLabel}
        </button>
      )}

      {onResend && (
        <button type="button" onClick={onResend}>
          Resend OTP
        </button>
      )}
    </form>
  );
}



// "use client";
// import { useState } from "react";

// type Props = {
//   onVerify: (otp: string) => Promise<void>;

//   onResend?: () => Promise<void>;
// };

// export function OTPForm({ onVerify, onResend }: Props) {
//   const [otp, setOtp] = useState("");

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (otp.length !== 6) return;
//     await onVerify(otp);
//   };

//   return (
//     <form onSubmit={submit}>
//       <input
//         type="text"
//         inputMode="numeric"
//         pattern="[0-9]*"
//         maxLength={6}
//         value={otp}
//         onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//         placeholder="Enter 6-digit OTP"
//       />

//       <button type="submit" disabled={otp.length !== 6}>
//        submit
//       </button>

//       {onResend && (
//         <button type="button" onClick={onResend}>
//           Resend OTP
//         </button>
//       )}
//     </form>
//   );
// }
