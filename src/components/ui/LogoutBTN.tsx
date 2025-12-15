"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}