
"use client";

import { useState } from "react";
import { getSocket } from "@/services/socket.service";
import { useChatStore } from "@/stores/chat.store";

interface ChatInputProps {
  chatId: string;
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const socketReady = useChatStore((s) => s.socketReady);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!socketReady) return;

    const message = text.trim();
    if (!message) return;

    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit("chat", {
      chatId,
      text: message,
    });

    setText("");
  };

  return (
    <form
      className="flex gap-2 p-4 border-t"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        inputMode="text"
        enterKeyHint="send"     
        className="flex-1 border rounded px-3 py-2"
      />

      <button
        type="submit"
        disabled={!socketReady}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </form>
  );
}
