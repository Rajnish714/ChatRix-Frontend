"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/ui.store";
import { useEffect } from "react";

export default function MyProfileModal() {
  const { user } = useAuth();
  const { activeModal, closeModal, openModal } = useUIStore();

  // ✅ modal visibility controlled here
  if (activeModal !== "profile") return null;
  if (!user) return null;

  return (
    <BaseModal onClose={closeModal} title="My Profile">
      <div className="p-4 text-center">
        <img
          src={user.profilePic ?? "/assets/user-rollback.png"}
          className="w-24 h-24 rounded-full mx-auto object-cover bg-gray-700"
          alt="profile"
        />

        <p className="mt-2 font-semibold">{user.name}</p>

        {/* Future */}
        <p className="text-xs text-gray-500">{user.username}</p>

        <button
          onClick={() => openModal("updateProfile")}
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
        >
          Edit Profile
        </button>
      </div>
    </BaseModal>
  );
}
