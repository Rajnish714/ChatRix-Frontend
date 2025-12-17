"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function RootPage() {
  const router = useRouter();
  const { token, isAuthloading } = useAuthStore();

  useEffect(() => {
    if (isAuthloading) return ;

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, isAuthloading]);

  return null
}