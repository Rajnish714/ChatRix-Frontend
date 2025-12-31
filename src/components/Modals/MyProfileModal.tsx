"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MyProfileModal({ open, onClose }: Props) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <BaseModal open={open} onClose={onClose} title="My Profile">
      <div className="p-4 text-center">
        <img
          src={user.profilepic ?? "/assets/user-rollback.png"}
          className="w-24 h-24 rounded-full mx-auto object-cover"
        />
        <p className="mt-2 font-semibold">{user.username}</p>
        {/* <p className="text-xs text-gray-500">{user.email}</p> add unique id for user for search and extra features */}
      </div>

  
    </BaseModal>
  );
}
