
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chat.store";
import { useAuth } from "@/hooks/useAuth";
import { useChatSocket } from "@/hooks/useChatSocket";
import SidebarProfile from "@/components/chat/SidebarProfile";
import SearchSidebarUser from "@/components/chat/SearchSidebarUser";
import { LogoutButton } from "@/components/ui/LogoutBTN";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const myId = user?.id;

  const { getAllChat, chats } = useChat();
  const { onlineUsers } = useChatStore();

  const [isSearching, setIsSearching] = useState(false);

  useChatSocket();

  useEffect(() => {
    getAllChat();
  }, [getAllChat]);

  return (
    <div className="h-screen flex">
      <aside className="w-64 border-r flex flex-col">
        <div className="p-4 flex justify-between">
          <span>ChatRix</span>
          <LogoutButton />
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

              return (
                <SidebarProfile
                  key={chat._id}
                  title={chat.isGroup ? chat.groupName : other?.username}
                  profilePic={chat.isGroup ? chat.groupImage : other?.profilePic}
                  isGroup={chat.isGroup}
                  isOnline={
                    !chat.isGroup &&
                    !!other?._id &&
                    onlineUsers.includes(other._id)
                  }
                  onClick={() =>
                    router.push(`/dashboard/chat/${chat._id}`)
                  }
                />
              );
            })}
          </div>
        )}
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
