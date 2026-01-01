"use client";

import { ReactNode } from "react";

interface Props {
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function BaseModal({ onClose, title, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="
          w-full md:w-96
          ui-elevated
          rounded-t-2xl md:rounded-2xl
          max-h-[80dvh]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          {title && <h2 className="font-semibold">{title}</h2>}
          <button onClick={onClose} className="text-lg">
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
