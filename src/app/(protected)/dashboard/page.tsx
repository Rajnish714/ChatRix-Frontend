"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const myUserId = user?.id;
  const { chats, getAllChat } = useChat();

  useEffect(() => {
    getAllChat();
  }, [getAllChat]);

  return (
    <div className="h-full md:hidden">
      <div className="px-4 py-3 border-b font-bold">
        Chats
      </div>

      {chats.map((chat) => {
        const title = chat.isGroup
          ? chat.groupName
          : chat.members.find(m => m._id !== myUserId)?.username;

        return (
          <div
            key={chat._id}
            onClick={() =>
              router.push(`/dashboard/chat/${chat._id}`)
            }
            className="px-4 py-3 border-b cursor-pointer"
          >
            {title}
          </div>
        );
      })}
    </div>
  );
}
