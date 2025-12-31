"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import { useChatStore } from "@/stores/chat.store";

interface User {
  _id: string;
  username: string;
  profilePic?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
}

export default function UserProfileModal({ open, onClose, user }: Props) {


  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const isOnline = onlineUsers.includes(user._id);
  if (!user) return null;
  return (
    <BaseModal open={open} onClose={onClose} title="User Info">
      <div className="p-4 text-center">
        <div className="relative w-24 h-24 mx-auto">
          <img
            src={user.profilePic ?? "/assets/user-rollback.png"}
            className="w-24 h-24 rounded-full object-cover"
          />

          {isOnline && (
            <span className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        <p className="mt-3 font-semibold text-lg">
          {user.username}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {user._id}
        </p>
      </div>
    </BaseModal>
  );
}
