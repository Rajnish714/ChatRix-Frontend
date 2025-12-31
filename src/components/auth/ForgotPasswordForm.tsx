
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
      className="space-y-4 ui-elevated" 
    >
      {/* Email field */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700"
        >
          Email address
        </label>

        <input
          id="email"
          value={email}
          type="email"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:border-blue-500 focus:outline-none focus:ring-2
                     focus:ring-blue-500/20"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white
                   transition hover:bg-blue-700
                   disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Sending OTP…" : "Send OTP"}
      </button>
    </form>
  );
}
