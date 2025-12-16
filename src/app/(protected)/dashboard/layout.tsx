"use client";
import SocketProvider from "@/providers/SocketProvider";

export default function DeshboardLayout({ children }: { children: React.ReactNode }) {

  return <SocketProvider>{children}</SocketProvider>;
}