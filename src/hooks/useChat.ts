
import { useState,useCallback, useEffect, } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useChatStore } from "@/stores/chat.store";
import { useChatService } from "@/services/chat.service";
import { GetMessagesRequest, Messages } from "@/types/chat.types";
import { getSocket } from "@/services/socket.service";

export const useChat=()=>{

      const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<string | null>(null);
  const {chats,chatId,setChats,setCurrentRoom,messages,setMessages}=useChatStore()
  
      const getAllChat= useCallback(async()=>{
    setError(null)
    setLoading(true)
    try{
    const res= await useChatService.getallChatRequest()
      setChats(res.data)
     
    return res.data
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  }
     ,[setChats] )

     const getMessages= useCallback(async (request: GetMessagesRequest)=>{
    setError(null)
    setLoading(true)
    try{
    const res= await useChatService.getMessagesRequest(request)
      setMessages(res.data)
     
    return res.data
    
     } catch (error) {
    setError(getErrorMessage(error));
     return null;
    }finally{
        setLoading(false)
    }
  }
     ,[setMessages] )

// useEffect(() => {
//   const socket = getSocket();
//   if (!socket) return;

//   const handleNewMessage = (message: Messages) => {
//     setMessages(
//       messages.some((m) => m._id === message._id)
//         ? messages
//         : [...messages, message]
//     );
//   };

//   socket.on("new-message", handleNewMessage);

//   return () => {
//     socket.off("new-message", handleNewMessage);
//   };
// }, [messages, setMessages]);

  return {
    chats,
    chatId,
    setCurrentRoom,
    setChats,
    isError,
    isLoading,
    getAllChat,
    messages,
   getMessages
  }
}