"use client";

interface SidebarProfileProps {
  title?: string | null;
  profilePic?: string | null;
  preview?: string;
  isGroup?: boolean;
  isOnline: boolean;
  onClick?: () => void;
}

export default function SidebarProfile({
  title,
  profilePic,
  preview,
  isGroup,
  isOnline,
  onClick,
}: SidebarProfileProps) {


  
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 cursor-pointer  ui-hover "
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
         src={
            profilePic
              ? profilePic
              : isGroup
              ? "/assets/group-rollback.png"
              : "/assets/user-rollback.png"
          }
          width={36}
          height={36}
          className="rounded-full object-cover bg-gray-700"
          alt="profile"
        />
        

        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">{title}</span>

        {preview && (
          <span className="text-xs text-gray-500 truncate">
            {preview}
          </span>
        )}

        {isGroup && (
          <span className="text-xs text-gray-400">Group</span>
        )}
      </div>
    </div>
  );
}
