import { create } from "zustand";
import { Chat, Messages, GetMessagesResponse } from "@/types/chat.types";

interface CacheChat {
  messages: Messages[];
  page: number;
  hasMore: boolean;
  hydrated: boolean;
}

interface ChatStore {
  chats: Chat[];
  messagesByChat: Record<string, CacheChat>;
  selectedChatId: string | null;

  socketReady: boolean;
  onlineUsers: string[];

  setMessagesByChat: (chatId: string, response: GetMessagesResponse) => void;
  addMessagesByChat: (chatId: string, message: Messages) => void;

  setOnlineUsers: (users: string[]) => void;
  setSocketReady: (v: boolean) => void;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;

  updateLastMessage: (chatId: string, lastMessage: Chat["lastMessage"]) => void;

  setSelectedChatId: (chatId: string | null) => void;
  updateMessageDelivered: (
    chatId: string,
    messageId: string,
    userId: string
  ) => void;

  updateMessageSeen: (
    chatId: string,
    messageId: string,
    viewerId: string
  ) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],

  messagesByChat: {},
  selectedChatId: null,
  onlineUsers: [],
  socketReady: false,

  setSocketReady: (v) => set({ socketReady: v }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setChats: (chats) => set({ chats }),

  addChat: (chat) =>
    set((state) => ({
      chats: state.chats.some((c) => c._id === chat._id)
        ? state.chats
        : [chat, ...state.chats],
    })),

  updateLastMessage: (chatId, lastMessage) =>
    set((state) => ({
      chats: state.chats
        .map((c) => (c._id === chatId ? { ...c, lastMessage } : c))
        .sort(
          (a, b) =>
            new Date(b.lastMessage?.createdAt ?? 0).getTime() -
            new Date(a.lastMessage?.createdAt ?? 0).getTime()
        ),
    })),

  setMessagesByChat: (chatId, response) =>
    set((state) => {
      const prev = state.messagesByChat[chatId];

      const apiMessages = [...response.messages].reverse();

      const socketMessages = prev?.messages ?? [];

      const apiIds = new Set(apiMessages.map((m) => m._id));

      const merged = [
        ...apiMessages,
        ...socketMessages.filter((m) => !apiIds.has(m._id)),
      ];

      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: {
            messages: merged,
            page: response.pagination.page,
            hasMore: response.pagination.hasNextPage,
            hydrated: true,
          },
        },
      };
    }),

  addMessagesByChat: (chatId, message) =>
    set((state) => {
      const prev = state.messagesByChat[chatId];

      const prevMessages = prev?.messages ?? [];

      if (prevMessages.some((m) => m._id === message._id)) {
        return state;
      }

      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: {
            messages: [...prevMessages, message],
            page: prev?.page ?? 1,
            hasMore: prev?.hasMore ?? true,
            hydrated: prev?.hydrated ?? false,
          },
        },
      };
    }),

  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),

  updateMessageDelivered: (chatId: string, messageId: string, userId: string) =>
    set((state) => {
      const cache = state.messagesByChat[chatId];
      if (!cache) return state;

      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: {
            ...cache,
            messages: cache.messages.map((m) =>
              m._id === messageId && !m.deliveredTo.includes(userId)
                ? { ...m, deliveredTo: [...m.deliveredTo, userId] }
                : m
            ),
          },
        },
      };
    }),

  updateMessageSeen: (chatId, messageId, viewerId) =>
    set((state) => {
      const chat = state.messagesByChat[chatId];
      if (!chat) return state;

      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: {
            ...chat,
            messages: chat.messages.map((m) =>
              m._id === messageId && !m.seenBy.includes(viewerId)
                ? {
                    ...m,
                    seenBy: [...m.seenBy, viewerId],
                  }
                : m
            ),
          },
        },
      };
    }),
}));
