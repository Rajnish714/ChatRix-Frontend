
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useChatStore } from "@/stores/chat.store";
import { useChatService } from "@/services/chat.service";
import { Chat, CreateGroupRequest, GetMessagesRequest,SearchRequest, SearchSidebarResponse, SearchUsersResponse } from "@/types/chat.types";
import { useAuthStore } from "@/stores/auth.store";

export const useChat = () => {

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string | null>(null);
    const { chats, selectedChatId, setChats, setSelectedChatId  ,addChat} =
    useChatStore();

    const {user}=useAuthStore()

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

      useChatStore
        .getState()
        .setMessagesByChat(request.chatId, res);
      // const normalized = res.messages.reverse(); 

      // setMessages(prev =>
      //   request.page && request.page > 1
      //     ? [...normalized, ...prev]   
      //     : normalized                
      // );

      return {
        messages: res.messages,
        hasMore: res.pagination.hasNextPage,
      };
    } catch (error) {
      setError(getErrorMessage(error));
      return null;
    } finally {
      setLoading(false);
    }
  },
  []
)

const searchSidebarUsers = useCallback(
  async (request: SearchRequest) => {
    setError(null);

    if (!request.q || !request.q.trim()) {
      return {
        users: [],
        groups: [],
        hasMore: false,
      };
    }

    setLoading(true);

    try {
      const res = await useChatService.searchSidebarUsersRequest(request);

      return {
        users: res.users,
        groups: res.groups,
        hasMore:
          res.pagination.users.hasNextPage ||
          res.pagination.groups.hasNextPage,
      };
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  },
  []
)

const createGroup = useCallback(
  async (payload: CreateGroupRequest) => {
    setError(null);
    setLoading(true);

    try {
      console.log(payload);
      await useChatService.createGroupRequest(payload);

  
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  },
  []
)
const searchUsers = useCallback(
  async (params: SearchRequest): Promise<SearchUsersResponse> => {
    if (!params.q?.trim()) {
      return {
        message: "",
        users: [],
        hasMore: false,
        pagination: {
          total: 0,
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    setLoading(true);
    setError(null);

    try {
      return await useChatService.searchUsersRequest(params);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  },
  []
);
const getOrCreatePrivateChat = useCallback(
    async (otherUser: {
      _id: string;
      username: string;
      profilePic?: string | null;
    }) => {
      if (!user) throw new Error("User not authenticated");

      setError(null);
      setLoading(true);

      try {
        const res =
          await useChatService.getOrCreatePrivateChatIdRequest(
            otherUser._id
          );

        const chat = res;

        const normalizedChat: Chat = {
          _id: chat._id,
          isGroup: false,
          members: [
            {
              _id: user._id,
              username: user.username,
              profilePic: user.profilepic,
            },
            {
              _id: otherUser._id,
              username: otherUser.username,
              profilePic: otherUser.profilePic,
            },
          ],
          groupName: null,
          groupImage: chat.groupImage,
          admins: [],
          lastMessage: null,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        };

        addChat(normalizedChat);
        return normalizedChat;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, addChat]
  );
  return {
    chats,
    selectedChatId,
    setSelectedChatId,
    setChats,
    isError,
    isLoading,
    getAllChat,
    getMessages,
    searchSidebarUsers,
    searchUsers,
    getOrCreatePrivateChat,
    createGroup

  };
};
