"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isAuthloading } = useAuthStore();

  useEffect(() => {
    if (!isAuthloading && token) {
      router.replace("/dashboard");
    }
  }, [isAuthloading, token]);

  if (isAuthloading || token) return <div><h1>redirecting</h1></div>;

  return <>{children}</>;
}