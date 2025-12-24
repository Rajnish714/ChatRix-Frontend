"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chat.store";
import ChatInput from "@/components/ChatInput";
import { getSocket } from "@/services/socket.service";
import { Messages } from "@/types/chat.types";
import Image from "next/image";
import { Tick } from "@/components/ui/Tick";

const EMPTY_MESSAGES: Messages[] = [];
const TOP_THRESHOLD = 40;

export default function ChatPage() {
  const params = useParams<{ chatId?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const chatId =
    params.chatId && params.chatId !== "new" ? params.chatId : null;

  const receiverUser =
    !chatId && searchParams.get("userId")
      ? {
          _id: searchParams.get("userId")!,
          username: searchParams.get("username")!,
          profilePic: searchParams.get("profilePic") || null,
        }
      : null;

  const { user } = useAuth();
  const { getMessages } = useChat();

  const setSelectedChatId = useChatStore((s) => s.setSelectedChatId);

  const activeMessages = useChatStore((s) =>
    chatId
      ? s.messagesByChat[chatId]?.messages ?? EMPTY_MESSAGES
      : EMPTY_MESSAGES
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);
  const loadingRef = useRef(false);
  const seenRef = useRef<Set<string>>(new Set());

  const [initialLoading, setInitialLoading] = useState(false);

  const handleScroll = async () => {
    const el = containerRef.current;
    if (!el || !chatId) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;

    isAtBottomRef.current = atBottom;

    if (el.scrollTop <= TOP_THRESHOLD && !loadingRef.current) {
      const cache = useChatStore.getState().messagesByChat[chatId];

      if (!cache || !cache.hasMore) return;

      loadingRef.current = true;
      const prevHeight = el.scrollHeight;

      await getMessages({
        chatId,
        page: cache.page + 1,
      });

      requestAnimationFrame(() => {
        const newHeight = el.scrollHeight;
        el.scrollTop = newHeight - prevHeight;
        loadingRef.current = false;
      });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isAtBottomRef.current) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [activeMessages.length]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!chatId) {
        setSelectedChatId(null);
        return;
      }

      setSelectedChatId(chatId);

      const cache = useChatStore.getState().messagesByChat[chatId];

      if (!cache || !cache.hydrated) {
        setInitialLoading(true);
        await getMessages({ chatId, page: 1 });
        if (!cancelled) setInitialLoading(false);
      } else {
        setInitialLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
  const socket = getSocket();
  if (!socket || !chatId || !user?.id) return;

  activeMessages.forEach((m) => {
    if (m.sender._id === user.id) return;

    if (!m.deliveredTo.includes(user.id)) {
      socket.emit("messageDelivered", { messageId: m._id });
    }

    if (
      !m.seenBy.includes(user.id) &&
      !seenRef.current.has(m._id)
    ) {
      seenRef.current.add(m._id);
      socket.emit("messageSeen", { messageId: m._id });
    }
  });
}, [chatId, activeMessages, user?.id]);

  return (
    <div key={chatId} className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <button onClick={() => router.push("/dashboard")} className="md:hidden">
          ←
        </button>
        <h1 className="font-bold text-lg">
          {chatId ? "Chat" : receiverUser?.username}
        </h1>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
      >
        {initialLoading && (
          <div className="text-center text-gray-400">Loading…</div>
        )}

        {activeMessages.map((msg) => {
          const isMe = msg.sender._id === user?.id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg text-white
                     ${isMe ? "bg-blue-500" : "bg-gray-600"}`}
              >
                {msg.messageType === "gif" && msg.mediaUrl && (
                  <div className="relative rounded-lg bg-black/10 pt-1.25 px-1.25 pb-1.5">
                    <Image
                      src={msg.mediaUrl}
                      alt="gif"
                      width={300}
                      height={300}
                      className="block w-full max-w-60 sm:max-w-70 h-auto rounded-md"
                      unoptimized
                    />

                    <span className="absolute bottom-2 right-2 text-[10px] text-white  px-1.5 py-px rounded">
                      <Tick message={msg} isMe={isMe} />
                    </span>
                  </div>
                )}

                {msg.messageType === "text" && (
                  <div className="px-4 py-2">
                    <p className="whitespace-pre-wrap wrap-break-word">
                      {msg.text}
                    </p>

                    <div className="mt-1 flex justify-end">
                      <Tick message={msg} isMe={isMe} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput chatId={chatId} receiverUser={receiverUser} />
    </div>
  );
}
