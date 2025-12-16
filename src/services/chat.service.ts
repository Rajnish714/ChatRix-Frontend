import api from "@/utils/axios";
import { GetAllChatsResponse,GetMessagesRequest,GetMessagesResponse } from "@/types/chat.types";

export const useChatService={
      getallChatRequest: async (): Promise<GetAllChatsResponse> => {
    const res = await api.get("/chat/get-allchat");
    return res.data;
  },

getMessagesRequest: async (
  request: GetMessagesRequest
): Promise<GetMessagesResponse> => {
  const { chatId } = request;

  const res = await api.get("/messages", {
    params: { chatId }
  });

  return res.data;
}
}