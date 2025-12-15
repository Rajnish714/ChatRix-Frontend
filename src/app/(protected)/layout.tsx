"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isAuthloading } = useAuthStore();

  useEffect(() => {
    if (!isAuthloading && !token) {
      router.replace("/login");
    }
  }, [isAuthloading, token]);

  if (isAuthloading) return <div><h1>redirecting</h1></div>;
  if (!token) return null;

  return <>{children}</>;
}