"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/services/socket.service";
import { useChatStore } from "@/stores/chat.store";

  

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  console.log("🟢 SocketProvider render");

   
    const{isAuthloading}=useAuthStore()

    const {token} = useAuth()
useEffect(() => {
  if (isAuthloading || !token) return;

  const socket = connectSocket(token);

  socket.on("connect", () => {
    console.log("🔌 socket connected:", socket.id);
    useChatStore.getState().setSocketReady(true);
  });

  socket.on("disconnect", () => {
    console.log("🔴 socket disconnected");
    useChatStore.getState().setSocketReady(false);
  });
}, [token, isAuthloading]);
  return <>{children}</>;
}
