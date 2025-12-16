"use client";

import { useEffect } from "react";
import { LogoutButton } from "@/components/ui/LogoutBTN";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const {getMessages,messages,isError,isLoading,setCurrentRoom}=useChat()
  const { user } = useAuth();

  

useEffect(() => {
  if (!chatId) return;
setCurrentRoom(chatId);
getMessages({chatId});
}, [chatId]);



  return (
    <div>
<div className="flex items-center justify-between px-6 py-4 border-b">
  {/* Left: Dashboard title */}
  <h1 className="text-2xl font-bold text-blue-600">
    Chat {chatId}
  </h1>

  {/* Right: User info */}
  <button
    className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
  >
    <span>{user?.username}</span>
  </button>
</div> 
    

      {messages?.map(msg => {
      

        return (
          <div key={msg._id}>
            <h1>{msg.text}</h1>
          </div>
        );
      })}

      <LogoutButton />
    </div>
  );
}
