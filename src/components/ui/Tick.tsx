// "use client";
interface TickProps {
   message: {
    deliveredTo: string[];
    seenBy: string[];
    createdAt: string;
  };
  isMe: boolean;
}

function SingleTick({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      className={className}
    >
      <path d="M6.173 12.414 2.05 8.293l1.414-1.414 2.709 2.708 6.364-6.364 1.414 1.414z" />
    </svg>
  );
}

function DoubleTick({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 16"
      width="18"
      height="18"
      fill="currentColor"
      className={className}
    >
      <path d="M1.5 8.5 4.5 11.5 10.5 5.5 9.5 4.5 4.5 9.5 2.5 7.5z" />
      <path d="M6.5 8.5 9.5 11.5 15.5 5.5 14.5 4.5 9.5 9.5 7.5 7.5z" />
    </svg>
  );
}
export function Tick({
  message,isMe
}: TickProps) {
  const timeOnly = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const delivered = message.deliveredTo.length > 0;
 const seen = isMe && message.seenBy.length > 0;

  return (
   <span
  className={`text-[8px]  text-gray-200  ${
    isMe
      ? "flex items-center gap-0.5"
      : "block text-right"
  }`}
>
  <span className={isMe ? "" : "block "}>
    {timeOnly}
  </span>

      {isMe && (
        delivered ? (
          <DoubleTick
            className={seen ? "text-sky-300" : "text-gray-300"}
          />
        ) : (
          <SingleTick className="text-gray-300" />
        )
      )}
    </span>

  );
}