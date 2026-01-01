import api from "@/utils/axios";
import { GetAllChatsResponse,GetMessagesRequest,GetMessagesResponse,SearchRequest,SearchSidebarResponse,PrivateChat, CreateGroupRequest, SearchUsersResponse,  AddGroupMembersBody, AddGroupMembersParams } from "@/types/chat.types";

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
 formData: FormData
): Promise<PrivateChat> => {
  const res = await api.post("/chat/create-group", formData);
  return res.data.chat;
},

addMemberRequest: async (
  params: AddGroupMembersParams,
  body: AddGroupMembersBody
): Promise<PrivateChat> => {
  const res = await api.patch(
    "/chat/add-member",
    body,          
    { params }    
  );

  return res.data.data;
},
//add admin remove member and admin 

leaveGroupRequest: async (chatId: string) => {
  const res = await api.post("/chat/leave-group",    null,        
    {
      params: { chatId }, 
    });
    
  return res.data;
}

}