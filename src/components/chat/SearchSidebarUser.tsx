"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchUser, SearchGroup } from "@/types/chat.types";
import { useChatStore } from "@/stores/chat.store";

interface Props {
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
}

export default function SearchSidebarUser({ onSearchEnd }: Props) {
  const router = useRouter();
  const { searchSidebarUsers } = useChat();
  const chats = useChatStore((s) => s.chats);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [groups, setGroups] = useState<SearchGroup[]>([]);

  const debounced = useDebounce(query, 400);

  // useEffect(() => {
  //   if (!debounced.trim()) {
  //     setUsers([]);
  //     setGroups([]);
  //     return;
  //   }

  //   let cancelled = false;

  //   const run = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await searchSidebarUsers({ q: debounced });
  //       if (!cancelled) {
  //         setUsers(res.users);
  //         setGroups(res.groups);
  //       }
  //     } finally {
  //       if (!cancelled) setLoading(false);
  //     }
  //   };

  //   run();
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [debounced]);

  useEffect(() => {
    if (!debounced.trim()) {
      setUsers([]);
      setGroups([]);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const res = await searchSidebarUsers({ q: debounced });
        if (!cancelled) {
          setUsers(res.users);
          setGroups(res.groups);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [debounced, searchSidebarUsers]);

  const handleUserClick = (u: SearchUser) => {
    const existingChat = chats.find(
      (c) => !c.isGroup && c.members.some((m) => m._id === u._id)
    );
    setQuery("");
    onSearchEnd?.();

    if (existingChat) {
      router.push(`/dashboard/chat/${existingChat._id}`);
    } else {
     router.push(
  `/dashboard/chat/new?userId=${u._id}` +
  `&name=${encodeURIComponent(u.name)}` +
  `&username=${encodeURIComponent(u.username)}` +
  `&profilePic=${encodeURIComponent(u.profilePic ?? "")}`
);
    }
  };

  return (
    <div className="p-2 border-b">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        placeholder="Search users or groups"
      />

      {loading && <p className="text-xs mt-1 text-gray-400">Searching...</p>}

      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => handleUserClick(u)}
          className="flex items-center gap-3 px-4 py-2 cursor-pointer ui-hover"
        >
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u.profilePic ?? "/assets/user-rollback.png"}
              width={36}
              height={36}
              className="rounded-full object-cover"
              alt="profile"
            />
           
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{u.name}</span>
          </div>
        </div>
      ))}

      {groups.map((g) => (
        <div
          key={g._id}
          onClick={() => router.push(`/dashboard/chat/${g._id}`)}
          className="flex items-center gap-3 px-4 py-2 cursor-pointer ui-hover"
        >
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.groupImage ?? "/assets/group-rollback.png"}
              width={36}
              height={36}
              className="rounded-full object-cover"
              alt="profile"
            />

            {/* {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
        )} */}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{g.groupName}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
