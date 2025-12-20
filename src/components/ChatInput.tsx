
"use client";

import { useState, useRef } from "react";
import { getSocket } from "@/services/socket.service";
import { useChatStore } from "@/stores/chat.store";
import { useChatService } from "@/services/chat.service";
import { useRouter } from "next/navigation";

interface Props {
  chatId: string | null;
  receiverUser?: {
    _id: string;
    username: string;
    profilePic?: string | null;
  } | null;
}

export default function ChatInput({ chatId, receiverUser }: Props) {
  const router= useRouter()
  const { socketReady, setSelectedChatId } = useChatStore();

  const [text, setText] = useState("");
  const sendingRef = useRef(false);

  const sendMessage = async () => {
    const value = text.trim();
    if (!value || !socketReady || sendingRef.current) return;

    const socket = getSocket();
    if (!socket) return;

    sendingRef.current = true;

    let activeChatId = chatId;

    if (!activeChatId) {
      if (!receiverUser) {
        sendingRef.current = false;
        return;
      }

      const chat =
        await useChatService.getOrCreatePrivateChatIdRequest(
          receiverUser._id
        );

      activeChatId = chat._id;
      setSelectedChatId(activeChatId);
     router.push(`/dashboard/chat/${activeChatId}`);
    }

    socket.emit("chat", {
      chatId: activeChatId,
      text: value, 
    });

    setText("");
    sendingRef.current = false;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return; 
         if (!socketReady) return;
   
        sendMessage();
      }}
      className="flex gap-2 p-4 border-t"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2"
        placeholder="Type a message"
      />

      <button
        type="submit"
        
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
