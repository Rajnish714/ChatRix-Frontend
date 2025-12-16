"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { connectSocket,disconnectSocket } from "@/services/socket.service";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const {token} = useAuth()

    useEffect( ()=>{
        if(!token) return
        const socket = connectSocket(token)
         socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });


        return()=>{
                disconnectSocket()
        }
    },[token])

  return <>{children}</>;
}