"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";

export interface PickerUser {
  _id: string;
  name:string;
  username: string;
  profilePic?: string | null;
}

interface Props {
  selectedUsers: PickerUser[];
  onAdd: (user: PickerUser) => void;
  onRemove: (id: string) => void;
    excludeUserIds?: string[];
  placeholder?: string;
  height?: number;
}

export default function UserPicker({
  selectedUsers,
  onAdd,
  onRemove,
  placeholder = "Search users",
    excludeUserIds = [],
  height = 220,
}: Props) {
  const { searchUsers } = useChat();
  const chats = useChatStore((s) => s.chats);
  const myUserId = useAuthStore((s) => s.user?._id);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PickerUser[]>([]);
  const [loading, setLoading] = useState(false);

const cachedUsers = useMemo<PickerUser[]>(() => {
  const map = new Map<string, PickerUser>();

  chats.forEach((chat) => {
    chat.members.forEach((m) => {
      const id = typeof m === "string" ? m : m._id;

      if (id === myUserId) return;

      if (typeof m !== "string") {
        map.set(id, {
          _id: id,
          name:m.name,
          username: m.username,
          profilePic: m.profilePic ?? null,
        });
      }
    });
  });

  return Array.from(map.values());
}, [chats, myUserId]);

  /* ---------- search users ---------- */
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchUsers({
          q: query,
          page: 1,
          limit: 10,
        });
        setSearchResults(res.users);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query, searchUsers]);

  /* ---------- users to display ---------- */

const displayUsers = useMemo(() => {
  const base = query.trim() ? searchResults : cachedUsers;

  return base.filter((u) => {
    if (excludeUserIds.includes(u._id)) return false;
    if (selectedUsers.some((s) => s._id === u._id)) return false;
    return true;
  });
}, [query, searchResults, cachedUsers, selectedUsers, excludeUserIds]);

  /* ---------- UI ---------- */
  return (
    <div>
      {/* Search input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2 mb-2"
      />

      {/* Selected users */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((u) => (
            <span
              key={u._id}
              onClick={() => onRemove(u._id)}
              className="px-2 py-1 rounded text-sm cursor-pointer bg-gray-400 "
            >
              {u.username} ✕
            </span>
          ))}
        </div>
      )}

      {/* User list */}
      <div
        className="border rounded overflow-y-auto"
        style={{ maxHeight: height }}
      >
        {loading && (
          <p className="p-3 text-sm text-gray-500">Searching…</p>
        )}

        {!loading && displayUsers.length === 0 && (
          <p className="p-3 text-sm text-gray-400">No users found</p>
        )}

        {!loading &&
          displayUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => onAdd(u)}
              className="p-3 ui-hover cursor-pointer"
            >
              {u.username}
            </div>
          ))}
      </div>
    </div>
  );
}
