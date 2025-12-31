   "use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PasswordInput } from "./PasswordInput";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const { isError, isLoading, loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return;
    }

    await loginUser({
      email: cleanEmail,
      password: cleanPassword,
    });

   
  };

  return (
    <div className="min-h-screen flex items-center justify-center ui-elevated px-4">
      <div className="w-full max-w-lg ui-elevated rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center ">
          Login
        </h1>

        {isError && (
          <p className="text-sm text-red-600 text-center">{isError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium
                       hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex flex-col gap-2 text-sm text-center">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-gray-600 hover:underline"
          >
            Don’t have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

