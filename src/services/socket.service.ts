
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket) return socket;

  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;
  if (!SOCKET_URL) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");
  }
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    withCredentials: true,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}
