"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

/* MODALS */
import MyProfileModal from "@/components/Modals/MyProfileModal";
import CreateGroupModal from "@/components/Modals/chat/CreateGroupModal";
import UpdateProfileModal from "@/components/Modals/profile/UpdateProfileModal";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, isAuthloading } = useAuthStore();

  useEffect(() => {
    if (!isAuthloading && !token) {
      router.replace("/login");
    }
  }, [isAuthloading, token, router]);

  if (isAuthloading) return <div>Redirecting…</div>;
  if (!token) return null;

  return (
    <>
      {children}

      <MyProfileModal />
      <CreateGroupModal />
      <UpdateProfileModal/>
   
    
    </>
  );
}
