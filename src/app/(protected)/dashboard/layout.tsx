
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { LogoutButton } from "@/components/ui/LogoutBTN";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const myUserId = user?.id;
  const { getAllChat, chats } = useChat();

  useEffect(() => {
    getAllChat();
  }, [getAllChat]);

  return (
    <div className="h-screen flex">
      {/* 🔹 SIDEBAR (desktop only) */}
      <aside className="hidden md:flex w-64 border-r flex-col">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <span className="font-bold">ChatRix</span>
          <LogoutButton />
        </div>

        <div className="flex-1 overflow-y-auto">
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
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                {title}
                {chat.isGroup?" group":null}
              </div>
            );
          })}
        </div>
      </aside>

      {/* 🔹 RIGHT CONTENT */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
