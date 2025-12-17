import { useState, useCallback, useEffect } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useChatStore } from "@/stores/chat.store";
import { useChatService } from "@/services/chat.service";
import { GetMessagesRequest, Messages } from "@/types/chat.types";

export const useChat = () => {

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string | null>(null);
  const { chats, selectedChatId, setChats, setSelectedChatId ,messages, setMessages,clearMessages } =
    useChatStore();

  const getAllChat = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await useChatService.getallChatRequest();
      setChats(res.data);

      return res.data;
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    } finally {
      setLoading(false);
    }
  }, [setChats]);
const getMessages = useCallback(
  async (request: GetMessagesRequest) => {
    setError(null);
    setLoading(true);

    try {
      const res = await useChatService.getMessagesRequest(request);

      const normalized = res.messages.reverse(); 

      setMessages(prev =>
        request.page && request.page > 1
          ? [...normalized, ...prev]   
          : normalized                
      );

      return {
        messages: normalized,
        hasMore: res.pagination.hasNextPage,
      };
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    } finally {
      setLoading(false);
    }
  },
  [setMessages]
)
  return {
    chats,
    selectedChatId,
    setSelectedChatId,
    setChats,
    isError,
    isLoading,
    getAllChat,
    messages,
    getMessages,
    clearMessages
  };
};
