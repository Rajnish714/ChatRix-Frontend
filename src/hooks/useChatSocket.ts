"use client";

import { useEffect } from "react";
import { getSocket } from "@/services/socket.service";
import { useChatStore } from "@/stores/chat.store";
import { Messages } from "@/types/chat.types";
import { useAuth } from "./useAuth";


export const useChatSocket = () => {
  const { user, token } = useAuth();
  const socketReady = useChatStore((s) => s.socketReady);

  /* logout */
  useEffect(() => {
    if (!token) {
      const socket = getSocket();
      if (socket) socket.disconnect();
    }
  }, [token]);

  /* messages / delivered / seen */
  useEffect(() => {
    if (!socketReady || !user?._id) return;

    const socket = getSocket();
    if (!socket) return;

    const handleMessage = (message: Messages) => {
      if (message.sender._id !== user._id) {
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

    socket.on(
      "messageDeliveredUpdate",
      ({ chatId, messageId, userId }: { chatId: string; messageId: string; userId: string }) => {
        useChatStore.getState().updateMessageDelivered(chatId, messageId, userId);
      }
    );

    socket.on(
      "messagesSeenUpdate",
      ({ chatId, messageId, userId }: { chatId: string; messageId: string; userId: string }) => {
        useChatStore.getState().updateMessageSeen(chatId, messageId, userId);
      }
    );

    return () => {
      socket.off("chat", handleMessage);
      socket.off("messageDeliveredUpdate");
      socket.off("messagesSeenUpdate");
    };
  }, [socketReady, user?._id]);

  /* online users / create chat / create group */
  useEffect(() => {
    if (!socketReady) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on("online_users", (users: string[]) => {
      useChatStore.getState().setOnlineUsers(users);
    });

    socket.on("new_chat", (chat: { _id: string }) => {
      useChatStore.getState().addChat(chat as never);
      socket.emit("joinChat", chat._id);
    });

    socket.on("group_created", (group: { _id: string }) => {
      useChatStore.getState().addChat(group as never);
      socket.emit("joinChat", group._id);
    });

  socket.on("memberLeft", ({ chatId, userId }) => {
    const myId= user?._id
  if (userId === myId) {
    useChatStore.getState().removeChat(chatId);
    socket.emit("leaveChat", chatId);
    return;
  }
    useChatStore.getState().removeGroupMember(chatId, userId);
});

socket.on("member-added", ({ chat }) => {
  const myId = user?._id;
  if (!myId) return;

  const isMember = chat.members.some(
    (m: string | { _id: string }) =>
      (typeof m === "string" ? m : m._id) === myId
  );

  if (!isMember) return;

  useChatStore.getState().addGroupMembers(chat);
  socket.emit("joinChat", chat._id);
});

    return () => {
      socket.off("online_users");
      socket.off("new_chat");
      socket.off("group_created");
      socket.off("memberLeft")
      socket.off("member-added")
    };
  }, [socketReady,user?._id]);
};
