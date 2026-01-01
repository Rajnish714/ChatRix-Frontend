"use client";

import { useChatStore } from "@/stores/chat.store";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePic?: string | null;
}

interface Props {
  isGroup?: boolean;
  groupName?: string;
  user?: User | null;
}

export default function ChatHeader({ isGroup, groupName, user }: Props) {
  const onlineUsers = useChatStore((s) => s.onlineUsers);

  // ✅ Guard FIRST
  if (!isGroup && !user) return null;

  const isOnline =
    !isGroup && user ? onlineUsers.includes(user._id) : false;

  return (
    <div className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded-full ui-hover">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            isGroup
              ? "/assets/group-rollback.png"
              : user?.profilePic ?? "/assets/user-rollback.png"
          }
          width={36}
          height={36}
          className="rounded-full object-cover bg-gray-700"
          alt="profile"
        />

        {!isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">
          {isGroup ? groupName : user?.name}
        </span>
      </div>
    </div>
  );
}
