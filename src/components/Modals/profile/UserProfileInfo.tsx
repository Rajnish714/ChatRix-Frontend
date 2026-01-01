"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import { useChatStore } from "@/stores/chat.store";
import { useUIStore } from "@/stores/ui.store";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePic?: string | null;
}

interface Props {
  user: User | null;
}

export default function UserProfileModal({ user }: Props) {
  const { activeModal, closeModal } = useUIStore();
  const onlineUsers = useChatStore((s) => s.onlineUsers);

  if (activeModal !== "userProfile") return null;
  if (!user) return null;

  const isOnline = onlineUsers.includes(user._id);

  return (
    <BaseModal onClose={closeModal} title="User Info">
      <div className="p-4 text-center">
        <div className="relative w-24 h-24 mx-auto">
          <img
            src={user.profilePic ?? "/assets/user-rollback.png"}
            className="w-24 h-24 rounded-full object-cover"
            alt="user"
          />

          {isOnline && (
            <span className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        <p className="mt-3 font-semibold text-lg">{user.name}</p>

        <p className="text-xs text-gray-500 mt-1 break-all">
          {user.username}
        </p>
      </div>
    </BaseModal>
  );
}
