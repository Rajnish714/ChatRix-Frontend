
"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chat.store";
import { useChatSocket } from "@/hooks/useChatSocket";
import ChatInput from "@/components/ChatInput";

const ensureMinDelay = async (startTime: number, minDelay = 0) => {
  const elapsed = Date.now() - startTime;
  const remaining = minDelay - elapsed;
  if (remaining > 0) {
    await new Promise((res) => setTimeout(res, remaining));
  }
};

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();

  const { user } = useAuth();
  const { getMessages, clearMessages } = useChat();

  const setSelectedChatId = useChatStore((s) => s.setSelectedChatId);
  const messages = useChatStore((s) => s.messages);

  // socket connection
  useChatSocket(chatId);

  // pagination + UX state (LOCAL)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPrepending, setIsPrepending] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // 🔹 INITIAL LOAD / CHAT SWITCH
  useEffect(() => {
    if (!chatId) return;

    startTransition(() => {
      setSelectedChatId(chatId);
      clearMessages();
      setPage(1);
      setHasMore(true);
      setInitialLoading(true);
    });

    const loadInitialMessages = async () => {
      const start = Date.now();

      await getMessages({ chatId, page: 1 });

      await ensureMinDelay(start, );

      setInitialLoading(false);

      requestAnimationFrame(() => {
        const el = containerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    };

    loadInitialMessages();
  }, [chatId]);

  // 🔹 LOAD OLDER MESSAGES (SCROLL UP) — NO FLICKER VERSION
  const handleScroll = async () => {
    const el = containerRef.current;
    if (!el || loadingMore || !hasMore || initialLoading) return;

    if (el.scrollTop === 0) {
      setLoadingMore(true);
      setIsPrepending(true); // 👈 freeze paint

      const prevHeight = el.scrollHeight;
      const nextPage = page + 1;

      const result = await getMessages({
        chatId,
        page: nextPage,
      });

      if (result) {
        setHasMore(result.hasMore);
        setPage(nextPage);

        // 1️⃣ wait for DOM update
        requestAnimationFrame(() => {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - prevHeight;

          // 2️⃣ wait one more frame before revealing
          requestAnimationFrame(() => {
            setIsPrepending(false);
          });
        });
      } else {
        setIsPrepending(false);
      }

      setLoadingMore(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 🔹 HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="md:hidden"
        >
          ←
        </button>
        <h1 className="font-bold text-lg">Chat</h1>
      </div>

      {/* 🔹 MESSAGES */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto px-4 py-3 space-y-2
          ${isPrepending ? "opacity-0" : "opacity-100"}`}
      >
        {/* Initial loader */}
        {initialLoading && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading chat...
          </div>
        )}

        {/* Load-more loader */}
        {loadingMore && !initialLoading && (
          <div className="text-center text-xs text-gray-400">
            Loading older messages...
          </div>
        )}

        {!initialLoading &&
          messages.map((msg) => {
            const isMe = msg.sender._id === user?.id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg text-white
                  ${isMe ? "bg-blue-500" : "bg-gray-600"}`}
                >
                  {!isMe && (
                    <div className="text-xs text-amber-300">
                      {msg.sender.username}
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
      </div>

      {/* 🔹 INPUT */}
      <div className="border-t shrink-0">
        <ChatInput chatId={chatId} />
      </div>
    </div>
  );
}
