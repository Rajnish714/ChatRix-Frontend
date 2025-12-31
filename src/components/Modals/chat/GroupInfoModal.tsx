"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import { Chat } from "@/types/chat.types";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/ui.store";

interface Props {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}
export default function GroupInfoModal({ open, onClose, chat }: Props) {
    const router= useRouter()
    const {leaveGroup,isLoading,isError}= useChat()
    const {user}= useAuth()
    const myId= user?._id
    const { openAddMember } = useUIStore();

    
  if (!chat) return null;

  const isOwner = chat.createdBy?.toString() === myId;
  const isAdmin = Boolean(
    chat.admins?.some(
      (a: string | { _id: string }) =>
        (typeof a === "string" ? a : a._id) === myId
    )
  );

  const canAddMember = isOwner || isAdmin;

 const handleLeaveGroup = async () => {
    try {
    //   await useChatService.leaveGroup(chat._id);
    await leaveGroup(chat._id)
    
      onClose();
      router.back()
    } catch (e) {
      console.error(e);
    }
  };


 
   return (
    <BaseModal open={open} onClose={onClose} title="Group Info">
      {/* Group Image */}
      <div className="flex  justify-center mt-4">
      <img
          src={chat.groupImage ?? "/assets/group-rollback.png"}
          className="w-24 h-24 rounded-full mx-auto object-cover bg-gray-700"
        />
      </div>

      {/* Group Name */}
      <p className="text-center font-semibold mt-2">
        {chat.groupName}
      </p>

      {/* Add Member (ADMIN / OWNER ONLY) */}
      {canAddMember && (
        <div className="px-4 mt-4">
          <button
            onClick={openAddMember}
            className="w-full py-2 rounded-lg bg-blue-600 text-white"
          >
            Add Member
          </button>
        </div>
      )}

      {/* Members List */}
      <div className="mt-4 max-h-[50vh] overflow-y-auto">
        <p className="px-4 text-sm text-gray-500">
          Members ({chat.members.length})
        </p>

        {chat.members.map((m) => {
          const id = typeof m === "string" ? m : m._id;
          const name = typeof m === "string" ? m : m.username;

          const memberIsAdmin = Boolean(
            chat.admins?.some(
              (a: string | { _id: string }) =>
                (typeof a === "string" ? a : a._id) === id
            )
          );

          return (
            <div
              key={id}
              className="px-4 py-2 flex items-center justify-between"
            >
              <span>{name}</span>
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
        className="w-full mt-4 py-3  hover:text-red-700 text-red-500 disabled:opacity-50"
      >
        {isLoading ? "Leaving..." : "Leave Group"}
      </button>
    </BaseModal>
  );
}