"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import UserPicker, { PickerUser } from "@/components/common/UserPicker";
import { useChat } from "@/hooks/useChat";
import { Chat } from "@/types/chat.types";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}

export default function AddGroupMemberModal({
  open,
  onClose,
  chat,
}: Props) {
  const { addGroupMembers, isLoading } = useChat();
  const [selectedUsers, setSelectedUsers] = useState<PickerUser[]>([]);

  const handleAddMembers = async () => {
    if (!selectedUsers.length) return;

    try {
      await addGroupMembers(chat._id, {
        members: selectedUsers.map((u) => u._id),
      });

      setSelectedUsers([]);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

 
  return (
    <BaseModal open={open} onClose={onClose} title="Add Members">
      <div className="p-4">
        <UserPicker
          selectedUsers={selectedUsers}
            excludeUserIds={chat.members.map((m) =>
    typeof m === "string" ? m : m._id
  )}
          onAdd={(u) =>
            setSelectedUsers((prev) => [...prev, u])
          }
          onRemove={(id) =>
            setSelectedUsers((prev) =>
              prev.filter((u) => u._id !== id)
            )
          }
        />

        <button
          onClick={handleAddMembers}
          disabled={isLoading || !selectedUsers.length}
          className="mt-4 w-full bg-blue-600 py-2 rounded text-white disabled:opacity-50"
        >
          {isLoading ? "Adding…" : "Add Members"}
        </button>
      </div>
    </BaseModal>
  );
}
