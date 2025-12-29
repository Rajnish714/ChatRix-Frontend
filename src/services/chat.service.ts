import api from "@/utils/axios";
import { GetAllChatsResponse,GetMessagesRequest,GetMessagesResponse,SearchRequest,SearchSidebarResponse,PrivateChat, CreateGroupRequest, SearchUsersResponse } from "@/types/chat.types";

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
  request: SearchRequest
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
},

 searchUsersRequest : async (
  request: SearchRequest
): Promise<SearchUsersResponse> => {
  const res = await api.get("/users/search", {
    params: request,
  });

  return res.data;
},

createGroupRequest: async (
  payload:CreateGroupRequest
): Promise<PrivateChat> => {
  const res = await api.post("/chat/create-group", payload);
  return res.data.chat;
}

}