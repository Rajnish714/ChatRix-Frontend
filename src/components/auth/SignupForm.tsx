
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PasswordInput } from "./PasswordInput";

export default function SignupForm() {
  const router = useRouter();
  const { isError, isLoading, signupUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await signupUser({
      username,
      email,
      password,
      profile,
    });

    if (success) {
      router.push("/signup/otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ui-elevated ">
      <div className="w-full max-w-md ui-elevated rounded-xl shadow-lg p-6 space-y-6">
        
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center ">
          Signup
        </h1>

        {/* Error */}
        {isError && (
          <p className="text-sm text-red-600 text-center">
            {isError}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="Username">Username</label>
          <input
            type="text"
            id="Username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            inputClassName="bg-white"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium
                       hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? "Sending OTP..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

 