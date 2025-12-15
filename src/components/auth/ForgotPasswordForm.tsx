"use client";
import { useState } from "react";

type Props = {
  onSubmit: (email: string) => void;
  
  isLoading?: boolean;
  error?: string | null;
};

export default function ForgotPasswordForm({
  onSubmit,

  isLoading,
  error,
}: Props) {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email);
      }}
    >
      <label htmlFor="email">Please enter your email</label>
      <input
        id="email"
        value={email}
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
   <button type="submit" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </button> 
    </form>
  );
}