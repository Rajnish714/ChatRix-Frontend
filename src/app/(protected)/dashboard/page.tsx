"use client";

import { useEffect } from "react";
import { LogoutButton } from "@/components/ui/LogoutBTN";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router= useRouter()
  const { user } = useAuth();
  const myUserId = user?.id;

  const { isError, isLoading, getAllChat, chats ,setCurrentRoom,getMessages} = useChat();

  useEffect(() => {
    getAllChat();
  }, [getAllChat]);

    const handleChat = async (chatId:string) => {
       setCurrentRoom(chatId)
       
       router.push(`dashboard/chat/${chatId}`)
  }
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading chats</p>;

  return (
    <div>
<div className="flex items-center justify-between px-6 py-4 border-b">
  {/* Left: Dashboard title */}
  <h1 className="text-2xl font-bold text-blue-600">
    Dashboard
  </h1>

  {/* Right: User info */}
  <button
    className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
  >
    <span>{user?.username}</span>
  </button>
</div> 
    

      {chats.map(chat => {
        const title = chat.isGroup
          ? chat.groupName
          : chat.members.find(m => m._id !== myUserId)?.username;

        return (
          <div key={chat._id}>
             <h1 onClick={()=>handleChat(chat._id)}>{title}</h1>
          
          </div>
        );
      })}

      <LogoutButton />
    </div>
  );
}
