
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "next-themes";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, isAuthloading } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();


  useEffect(() => {
    if (!isAuthloading && token) {
      router.replace("/dashboard");
    }
  }, [isAuthloading, token, router]);


  if (isAuthloading || !resolvedTheme) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

  if (token) return null;

  return (
    <div className="relative min-h-screen  ui-elevated">
     
      <button
        aria-label="Toggle theme"
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        className="absolute right-4 top-4 rounded-full border ui-evelated "
      >
        {resolvedTheme === "dark" ? "🌞" : "🌙"}
      </button>

     
      <div className="flex min-h-screen items-center justify-center px-4">
  <div className="w-full max-w-lg">
    {children}
  </div>
</div>
    </div>
  );
}