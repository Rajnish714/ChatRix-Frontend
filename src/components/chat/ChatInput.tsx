
"use client";

import { useState, useRef, useEffect } from "react";
import { getSocket } from "@/services/socket.service";
import { useChatStore } from "@/stores/chat.store";
import { useChatService } from "@/services/chat.service";
import { useRouter } from "next/navigation";
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from "@fortawesome/free-solid-svg-icons";

type SendMessagePayload = {
  messageType?: "text" | "gif";
  text?: string;
  mediaUrl?: string;
};

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
  const TENOR_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY ?? "";
 

  const { socketReady, setSelectedChatId } = useChatStore();

  const [text, setText] = useState("");
  const [showEmoji,setShowEmoji]=useState(false)
  const [showGif,setShowGif]=useState(false)
  const sendingRef = useRef(false);
  const gifRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
 const close = (e: MouseEvent) => {
    if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
      setShowEmoji(false);
      //  setShowGif(false)
    }
  };

  document.addEventListener("mousedown", close);
  return () => document.removeEventListener("mousedown", close);
})

const sendMessage = async (payload: SendMessagePayload = {}) => {
  if (!socketReady || sendingRef.current) return;

  const socket = getSocket();
  if (!socket) return;

  const finalMessageType = payload.messageType ?? "text";
  const finalText = payload.text ?? text.trim();
  const finalMediaUrl = payload.mediaUrl ?? null;

  if (finalMessageType === "text" && !finalText) return;
  if (finalMessageType === "gif" && !finalMediaUrl) return;

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
    messageType: finalMessageType,
    text: finalMessageType === "text" ? finalText : "",
    mediaUrl: finalMediaUrl,
  });

  setText("");
  sendingRef.current = false;
};
  const handleAutoGrow = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const el = e.currentTarget;

  el.style.height = "auto";           
  el.style.height = `${el.scrollHeight}px`; 
};
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage();
    setShowEmoji(false);
  }
};

  return (
<form
  onSubmit={(e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!socketReady) return;
    setShowEmoji(false);
    setShowGif(false)
    sendMessage();
  }}
  className="flex items-center gap-2 p-3 border-t w-full min-w-0"
>
 
<textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  onInput={handleAutoGrow}
  onKeyDown={handleKeyDown}
  placeholder="Type a message"
  rows={1}
  className="
    flex-1 min-w-0
    resize-none
    border rounded
    px-3 py-2
    leading-5
    overflow-y-auto
    max-h-32
  "
/>
  <div ref={emojiRef} className="relative shrink-0">
    {showEmoji && (
      <div className="    fixed md:absolute
    bottom-16
    left-1/2 md:left-auto
    -translate-x-1/2 md:translate-x-0
    md:right-0
    z-50
    max-w-[95vw]
  ">
        <EmojiPicker
          onEmojiClick={(emoji) => {
            setText((prev) => prev + emoji.emoji);
            
          }}
        />
      </div>
    )}

    <button
      type="button"
        onClick={() => {
  setShowGif(false);
  setShowEmoji((p) => !p);
}}
      className="p-1 shrink-0"
    >
      <Emoji unified="1f600" size={22} />
    </button>
  </div>

  <div ref={gifRef} className="relative shrink-0">
    {showGif && (
      <div className="    fixed md:absolute
    bottom-16
  ui-elevated 
    left-1/2 md:left-auto
    -translate-x-1/2 md:translate-x-0
    md:right-0
    z-50
    max-w-[95vw] ">
      <GifPicker tenorApiKey={TENOR_KEY} onGifClick={(gif) => {
    const url = gif.url;
     
    sendMessage({
      messageType: "gif",
      mediaUrl: url,
    })

    setShowGif(false);
  }} />
      </div>
    )}

    <button
      type="button"
       onClick={() => {
   setShowEmoji(false);
  setShowGif((p) => !p);
}}
      className="p-1"
    >
      <FontAwesomeIcon icon={faImages} />
    </button>
  </div>

  <button
    type="submit"
    
    className="shrink-0 px-3 py-2 bg-blue-600 text-white rounded"
  >
    Send
  </button>
</form>
 
  );
}
