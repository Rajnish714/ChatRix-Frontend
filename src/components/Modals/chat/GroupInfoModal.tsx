"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import { Chat } from "@/types/chat.types";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/ui.store";

interface Props {
  chat: Chat;
}

export default function GroupInfoModal({ chat }: Props) {
  const router = useRouter();
  const { leaveGroup, isLoading } = useChat();
  const { user } = useAuth();
  const myId = user?._id;

  const { activeModal, closeModal, openModal } = useUIStore();

  // ✅ Modal visibility handled here
  if (activeModal !== "groupInfo") return null;
  if (!chat) return null;

  const isOwner = chat.createdBy === myId;

  const isAdmin = Boolean(
    chat.admins?.some((a) => a === myId)
  );

  const canAddMember = isOwner || isAdmin;

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(chat._id);
      closeModal();
      router.back();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BaseModal onClose={closeModal} title="Group Info">
      {/* Group Image */}
      <div className="flex justify-center mt-4">
        <img
          src={chat.groupImage ?? "/assets/group-rollback.png"}
          className="w-24 h-24 rounded-full object-cover bg-gray-700"
          alt="group"
        />
      </div>

      {/* Group Name */}
      <p className="text-center font-semibold mt-2">
        {chat.groupName}
      </p>

      {/* Add Member */}
      {canAddMember && (
        <div className="px-4 mt-4">
          <button
            onClick={() => openModal("addMember")}
            className="w-full py-2 rounded-lg bg-blue-600 text-white"
          >
            Add Member
          </button>
        </div>
      )}

      {/* Members */}
      <div className="mt-4 max-h-[50vh] overflow-y-auto">
        <p className="px-4 text-sm text-gray-500">
          Members ({chat.members.length})
        </p>

        {chat.members.map((m) => {
          const memberIsAdmin = chat.admins?.includes(m._id);

          return (
            <div
              key={m._id}
              className="px-4 py-2 flex items-center justify-between"
            >
              <span>{m.username}</span>

              {memberIsAdmin && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                  admin
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Leave Group */}
      <button
        onClick={handleLeaveGroup}
        disabled={isLoading}
        className="w-full mt-4 py-3 text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {isLoading ? "Leaving..." : "Leave Group"}
      </button>
    </BaseModal>
  );
}
