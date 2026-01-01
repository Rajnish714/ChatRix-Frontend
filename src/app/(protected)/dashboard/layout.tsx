"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chat.store";
import { useAuth } from "@/hooks/useAuth";
import { useChatSocket } from "@/hooks/useChatSocket";
import SidebarProfile from "@/components/chat/SidebarProfile";
import SearchSidebarUser from "@/components/chat/SearchSidebarUser";
import MoreMenu from "@/components/ui/MoreMenu";
import { usePathname } from "next/navigation";
import { getSocket } from "@/services/socket.service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const myId = user?._id;
 const socketReady = useChatStore((s) => s.socketReady);
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/dashboard/chat");
  const { getAllChat, chats } = useChat();
  const { onlineUsers } = useChatStore();

  const [isSearching, setIsSearching] = useState(false);
 
 
 useChatSocket();
  useEffect(() => {
    getAllChat();
  }, [getAllChat]);

useEffect(() => {
  if (!socketReady || !myId || chats.length === 0) return;

  const socket = getSocket();
  if (!socket) return;

  chats.forEach((chat) => {
    const last = chat.lastMessage;
    if (!last) return;
 
    if (last.sender !== myId) {
        socket.emit("messageDelivered", { messageId: last._id });
    }
    
  });
}, [socketReady, chats, myId]);

  return (
    <div className="h-dvh flex overflow-x-hidden">
      {/* Pc  */}  
      <aside className="hidden md:flex w-64 border-r flex-col">
         
        <div className="p-4 flex justify-between items-center">
          <span className="font-bold"> ChattRix </span>
         <MoreMenu/>
        </div>

        <SearchSidebarUser
          onSearchStart={() => setIsSearching(true)}
          onSearchEnd={() => {
            setIsSearching(false);
            getAllChat();
          }}
        />

        {!isSearching && (
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => {
              const other = !chat.isGroup
                ? chat.members.find((m) => m._id !== myId)
                : null;
             const profilePic=  chat.isGroup ? chat.groupImage : other?.profilePic
                  

                return (
                <SidebarProfile
                  key={chat._id}
                  title={chat.isGroup ? chat.groupName : other?.name}
                  profilePic={profilePic}
                  isGroup={chat.isGroup}
                  isOnline={
                    !chat.isGroup &&
                    !!other?._id &&
                    onlineUsers.includes(other._id)
                  }
                  onClick={() => router.push(`/dashboard/chat/${chat._id}`)}
                />
              );
            })}
          </div>
        )}
      </aside>

     
      <main className="flex-1 min-w-0 overflow-x-hidden">
       
        <div className="md:hidden h-full">
          {isChatPage ? (
          
            children
          ) : (
          
            <div className="h-full flex flex-col">
             
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <span className="font-bold text-lg">ChatRix</span>
             
                  <MoreMenu/>
               
              </div>

              {/* phone search */}
              <SearchSidebarUser
                onSearchStart={() => setIsSearching(true)}
                onSearchEnd={() => {
                  setIsSearching(false);
                  getAllChat();
                }}
              />

              {/*  chat list */}
              {!isSearching && (
                <div className="flex-1 overflow-y-auto">
                  {chats.map((chat) => {
                       const other = !chat.isGroup
                ? chat.members.find((m) => m._id !== myId)
                : null;
             const profilePic=  chat.isGroup ? chat.groupImage : other?.profilePic
             const  isOnline= !chat.isGroup && !!other?._id &&  onlineUsers.includes(other._id)
                  
              return (
                    <div  key={chat._id} className="border-b ">
                   <SidebarProfile
                      key={chat._id}
                      title={chat.isGroup ? chat.groupName : other?.name}
                      profilePic={profilePic}
                      isGroup={chat.isGroup}
                      isOnline={
                      isOnline
                      }
                      onClick={() => router.push(`/dashboard/chat/${chat._id}`)}
                      />
                      </div>
                
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* pc chat page*/}
        <div className="hidden md:block h-full">{children}</div>
      </main>
    </div>
  );
}
