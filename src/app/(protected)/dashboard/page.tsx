"use client";

import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/ui/LogoutBTN";

export default function DashboardPage() {
  const router = useRouter();

  function handleChatPage() {
    router.push("/chat");
  }

  return (
    <div>
      <h1>dashboard</h1>
      <button onClick={handleChatPage}>chatpage</button>
      <LogoutButton/>
    </div>
  );
}