"use client";

import { useUIStore } from "@/stores/ui.store";
import CreateGroupModal from "@/components/Modals/chat/CreateGroupModal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeModal = useUIStore((s) => s.activeModal);

  return (
    <>
      {children}
      {activeModal === "createGroup" && <CreateGroupModal />}
    </>
  );
}
