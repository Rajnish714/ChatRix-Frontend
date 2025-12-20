// import { useState, useCallback } from "react";
// import { getErrorMessage } from "@/utils/getErrorMessage";
// import { useChatStore } from "@/stores/chat.store";
// import { useChatService } from "@/services/chat.service";
// import { Chat, GetMessagesRequest,SearchSidebarRequest } from "@/types/chat.types";
// import { useAuthStore } from "@/stores/auth.store";

// export const useChat = () => {

//   const [isLoading, setLoading] = useState(false);
//   const [isError, setError] = useState<string | null>(null);
//   const { chats, selectedChatId, setChats, setSelectedChatId ,addChat} =
//     useChatStore();
//     const {user}=useAuthStore()

//   const getAllChat = useCallback(async () => {
//     setError(null);
//     setLoading(true);
//     try {
//       const res = await useChatService.getallChatRequest();
//       setChats(res.data);

//       return res.data;
//     } catch (error) {
//       setError(getErrorMessage(error));
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, [setChats]);

//   const getMessages = useCallback(
//   async (request: GetMessagesRequest) => {
//     const { chatId, page = 1 } = request;

//     setError(null);
//     setLoading(true);

//     try {
//       const store = useChatStore.getState();
//       const cached = store.messagesByChat[chatId];

//       // ✅ USE CACHE FOR FIRST PAGE
//       if (page === 1 && cached && cached.length > 0) {
//         return {
//           messages: cached,
//           hasMore: true,
//         };
//       }

//       const res = await useChatService.getMessagesRequest({
//         chatId,
//         page,
//       });

//       const normalized = res.messages.reverse();

//       store.setMessages(chatId, (prev) =>
//         page > 1 ? [...normalized, ...prev] : normalized
//       );

//       return {
//         messages: normalized,
//         hasMore: res.pagination.hasNextPage,
//       };
//     } catch (error) {
//       setError(getErrorMessage(error));
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   },
//   []
// );
// // const getMessages = useCallback(
// //   async (request: GetMessagesRequest) => {
// //     setError(null);
// //     setLoading(true);

// //     try {
// //       const res = await useChatService.getMessagesRequest(request);

// //       const normalized = res.messages.reverse(); 

// //       setMessages(prev =>
// //         request.page && request.page > 1
// //           ? [...normalized, ...prev]   
// //           : normalized                
// //       );

// //       return {
// //         messages: normalized,
// //         hasMore: res.pagination.hasNextPage,
// //       };
// //     } catch (error) {
// //       setError(getErrorMessage(error));
// //       return null;
// //     } finally {
// //       setLoading(false);
// //     }
// //   },
// //   [setMessages]
// // )

// const searchSidebarUsers = useCallback(
//   async (request: SearchSidebarRequest) => {
//     setError(null);

//     if (!request.q || !request.q.trim()) {
//       return {
//         users: [],
//         groups: [],
//         hasMore: false,
//       };
//     }

//     setLoading(true);

//     try {
//       const res = await useChatService.searchSidebarUsersRequest(request);

//       return {
//         users: res.users,
//         groups: res.groups,
//         hasMore:
//           res.pagination.users.hasNextPage ||
//           res.pagination.groups.hasNextPage,
//       };
//     } catch (error) {
//       setError(getErrorMessage(error));
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   },
//   []
// )
   
// const getOrCreatePrivateChat = useCallback(
//     async (otherUser: {
//       _id: string;
//       username: string;
//       profilePic?: string | null;
//     }) => {
//       if (!user) throw new Error("User not authenticated");

//       setError(null);
//       setLoading(true);

//       try {
//         const res =
//           await useChatService.getOrCreatePrivateChatIdRequest(
//             otherUser._id
//           );

//         const chat = res;

//         const normalizedChat: Chat = {
//           _id: chat._id,
//           isGroup: false,
//           members: [
//             {
//               _id: user.id,
//               username: user.username,
//               profilePic: user.profilepic,
//             },
//             {
//               _id: otherUser._id,
//               username: otherUser.username,
//               profilePic: otherUser.profilePic,
//             },
//           ],
//           groupName: null,
//           groupImage: chat.groupImage,
//           admins: [],
//           lastMessage: null,
//           createdAt: chat.createdAt,
//           updatedAt: chat.updatedAt,
//         };

//         addChat(normalizedChat);
//         return normalizedChat;
//       } catch (err) {
//         setError(getErrorMessage(err));
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [user, addChat]
//   );
//   return {
//     chats,
//     selectedChatId,
//     setSelectedChatId,
//     setChats,
//     isError,
//     isLoading,
//     getAllChat,
  
//     getMessages,

//     searchSidebarUsers,
//     getOrCreatePrivateChat

//   };
// };


import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useChatStore } from "@/stores/chat.store";
import { useChatService } from "@/services/chat.service";
import { Chat, GetMessagesRequest,SearchSidebarRequest } from "@/types/chat.types";
import { useAuthStore } from "@/stores/auth.store";

export const useChat = () => {

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string | null>(null);
  // const { chats, selectedChatId, setChats, setSelectedChatId ,messages, setMessages,clearMessages ,addChat} =
  //   useChatStore();
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
  async (request: SearchSidebarRequest) => {
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
              _id: user.id,
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
    getOrCreatePrivateChat

  };
};
