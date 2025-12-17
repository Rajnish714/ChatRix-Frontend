"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/services/socket.service";
import { useChatStore } from "@/stores/chat.store";
import { Messages } from "@/types/chat.types";
import { useAuth } from "./useAuth";

export const useChatSocket = (chatId?: string) => {
  const { setMessages, selectedChatId } = useChatStore();
  const currentRoomRef = useRef<string | null>(null);
  const { token } = useAuth();

  // ---- join chat room ----
  useEffect(() => {
    console.log("i run");
    if (!token) return;

    const socket = getSocket();
    if (!socket || !chatId) return;

    const joinRoom = () => {
      if (currentRoomRef.current === chatId) return;

      socket.emit("joinChat", chatId);
      currentRoomRef.current = chatId;
      console.log("joined room:", chatId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [chatId, token, selectedChatId]);

  // ---- receive messages ----
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    const handleNewMessage = (message: Messages) => {
      if (message.chatId !== chatId) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("chat", handleNewMessage);

    return () => {
      socket.off("chat", handleNewMessage);
    };
  }, [chatId, setMessages]);
};
