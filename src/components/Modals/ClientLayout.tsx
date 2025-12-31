"use client";

import { useUIStore } from "@/stores/ui.store";
import CreateGroupModal from "@/components/Modals/chat/CreateGroupModal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showCreateGroup = useUIStore((s) => s.showCreateGroup);

  return (
    <>
      {children}
      {showCreateGroup && <CreateGroupModal />}
    </>
  );
}
