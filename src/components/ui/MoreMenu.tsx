"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./LogoutBTN";
import { useUIStore } from "@/stores/ui.store";
import { useTheme } from "next-themes";

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const openCreateGroup = useUIStore((s) => s.openCreateGroup);
  const { resolvedTheme, setTheme } = useTheme();

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

  return (
    <div className="relative text-center " ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="
          p-2 rounded-full
          ui-hover
        "
      >
        ⋮
      </button>

      {open && (
        
        <div
          className="
            absolute rounded-2xl right-0 mt-2 w-40
          ui-elevated ui-border
         
          "
        >
          {/* Profile */}
          <button
            onClick={() => {
              router.push("/profile");
              setOpen(false);
            }}
            className="
              w-full  px-4 py-2
           ui-hover
            "
          >
            My Profile
          </button>

          {/* Create group */}
          <button
            onClick={() => {
              openCreateGroup();
              setOpen(false);
            }}
            className="
              w-full  px-4 py-2
           ui-hover
            "
          >
            Add Group
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
            className="
              w-full  px-4 py-2
           ui-hover
            "
          >
            {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout */}
          <div
            className="
              px-4 py-2 text-red-600
             ui-hover
            "
          >
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
