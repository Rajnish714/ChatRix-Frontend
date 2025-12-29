"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "next-themes";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isAuthloading } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => {
    if (!isAuthloading && token) {
      router.replace("/dashboard");
    }
  }, [isAuthloading, token]);

  if (isAuthloading || token) return <div><h1>redirecting</h1></div>;

  return <>   <div> <button
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
             
            }}
            className="
             w-full text-right px-4 py-2
             
            "
          >
            {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}

          </button></div> {children}</>;
}