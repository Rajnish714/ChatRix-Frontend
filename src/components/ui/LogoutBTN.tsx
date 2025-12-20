"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
 import { disconnectSocket } from "@/services/socket.service";
export function LogoutButton() {
  const { logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
     
  disconnectSocket();  
    router.replace("/login");
  };

  return (
  <button
    onClick={handleLogout}
    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white
               hover:bg-red-700 transition disabled:opacity-60"
  >
    Logout
  </button>
);
}