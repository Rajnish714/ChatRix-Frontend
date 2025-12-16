import { create } from "zustand";
import { Chat,Messages } from "@/types/chat.types";

interface ChatStore {
  chats:Chat[];
  messages: Messages[];
  chatId: string | null;

  setChats: (chats: Chat[]) => void;
  setMessages:(messages: Messages[]) => void;
  setCurrentRoom:(roomId: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  messages:[],
  chatId: null,

  setChats:async (chats) => set({ chats }),
  setMessages: async(messages) => set({ messages }),
  setCurrentRoom:async (chatId) => set({ chatId }),
}));