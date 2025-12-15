

"use client";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInitializer();
  return <>{children}</>;
}