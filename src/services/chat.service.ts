import api from "@/utils/axios";
import { GetAllChatsResponse,GetMessagesRequest,GetMessagesResponse,SearchSidebarRequest,SearchSidebarResponse,PrivateChat } from "@/types/chat.types";

export const useChatService={
      getallChatRequest: async (): Promise<GetAllChatsResponse> => {
    const res = await api.get("/chat/get-allchat");
    return res.data;
  },

getMessagesRequest: async (
  request: GetMessagesRequest
): Promise<GetMessagesResponse> => {
  const { chatId,page = 1, limit = 20 } = request;

  const res = await api.get("/messages", {
   params: { chatId, page, limit },
  });

  return res.data;
 
},

searchSidebarUsersRequest: async (
  request: SearchSidebarRequest
): Promise<SearchSidebarResponse> => {
  const { q } = request;

  const res = await api.get("/search", {
   params: { q },
  });

  return res.data;
},

getOrCreatePrivateChatIdRequest: async (
  otherUserId: string
): Promise<PrivateChat> => {
  const res = await api.post("/chat/private", { otherUserId });
  return res.data.chat;
}

}