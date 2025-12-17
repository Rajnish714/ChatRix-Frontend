
import { create } from "zustand";
import { Chat, Messages } from "@/types/chat.types";

interface ChatStore {
  chats: Chat[];
  messages: Messages[];
  selectedChatId: string | null;

  socketReady: boolean;
  setSocketReady: (v: boolean) => void;

  setChats: (chats: Chat[]) => void;
  setMessages: (
    messages:
      | Messages[]
      | ((prevMessages: Messages[]) => Messages[])
  ) => void;
  clearMessages: () => void;
  setSelectedChatId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  messages: [],
  selectedChatId: null,

  socketReady: false,
  setSocketReady: (v) => set({ socketReady: v }),

  setChats: (chats) => set({ chats }),

  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function"
          ? messages(state.messages)
          : messages,
    })),

  clearMessages: () => set({ messages: [] }),

  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
}));
