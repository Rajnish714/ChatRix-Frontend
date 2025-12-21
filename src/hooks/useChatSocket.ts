"use client";

import { useEffect } from "react";
import { getSocket } from "@/services/socket.service";
import { useChatStore } from "@/stores/chat.store";
import { Messages } from "@/types/chat.types";
import { useAuth } from "./useAuth";

export const useChatSocket = () => {
  const { user, token } = useAuth();

  const { setOnlineUsers, addChat } = useChatStore();

  useEffect(() => {
    if (!token) {
      const socket = getSocket();
      if (socket) {
        socket.disconnect();
      }
      return;
    }
  }, [token]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.id) return;

    const handleMessage = (message: Messages) => {
      if (message.sender._id !== user.id) {
        socket.emit("messageDelivered", { messageId: message._id });
      }

      useChatStore.getState().addMessagesByChat(message.chatId, message);
      useChatStore.getState().updateLastMessage(message.chatId, {
        _id: message._id,
        sender: message.sender._id,
        text: message.text,
        messageType: message.messageType,
        mediaUrl: message.mediaUrl ?? null,
        createdAt: message.createdAt,
      });
    };

    socket.on("chat", handleMessage);

    socket.on("messageDeliveredUpdate", ({ chatId, messageId, userId }) => {
      console.log("DELIVERED");
      useChatStore.getState().updateMessageDelivered(chatId, messageId, userId);
    });

    socket.on("messagesSeenUpdate", ({ chatId, messageId, userId }) => {
      console.log("SEEN");

      useChatStore.getState().updateMessageSeen(chatId, messageId, userId);
    });

    return () => {
      socket.off("chat", handleMessage);
      socket.off("messageDeliveredUpdate");
      socket.off("messagesSeenUpdate");
    };
  }, [user?.id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.id) return;

    const { messagesByChat } = useChatStore.getState();

    Object.values(messagesByChat).forEach((chat) => {
      chat.messages.forEach((m) => {
        if (m.sender._id !== user.id && !m.deliveredTo.includes(user.id)) {
          socket.emit("messageDelivered", { messageId: m._id });
        }
      });
    });
  }, [user?.id]); //useChatStore.getState().messagesByCha  iff code breaks add this in dependency of this useEffect

  //------------ new chat and create group socket--------------------

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("new_chat", (chat) => {
      addChat(chat);
      socket.emit("joinChat", chat._id);
    });

    socket.on("group_created", (group) => {
      addChat(group);
      socket.emit("joinChat", group._id);
    });

    return () => {
      socket.off("online_users");
      socket.off("new_chat");
      socket.off("group_created");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
