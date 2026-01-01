"use client";

import { useEffect, useRef, useState } from "react";
import { LogoutButton } from "./LogoutBTN";
import { useUIStore } from "@/stores/ui.store";
import { useTheme } from "next-themes";

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { openModal } = useUIStore();

  const { resolvedTheme, setTheme } = useTheme();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!resolvedTheme) return null;

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="More options"
        className="rounded-full p-2 ui-hover"
      >
        ⋮
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-48
            rounded-xl
            ui-elevated ui-border
            overflow-hidden
          "
        >
          {/* My Profile */}
          <MenuItem
            onClick={() => {
              openModal("profile");
              setOpen(false);
            }}
          >
            My Profile
          </MenuItem>

          {/* Create Group */}
          <MenuItem
            onClick={() => {
              openModal("createGroup");
              setOpen(false);
            }}
          >
            Add Group
          </MenuItem>

          {/* Divider */}
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Theme toggle */}
          <MenuItem
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
          >
            {resolvedTheme === "dark" ? "🌞 Light mode" : "🌙 Dark mode"}
          </MenuItem>

          {/* Divider */}
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Logout */}
          <div className="px-3 py-2 text-red-600 ui-hover">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable menu item */
function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 text-left text-sm ui-hover"
    >
      {children}
    </button>
  );
}
