"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import Spinner from "@/components/ui/Spinner";

export default function RootPage() {
  const router = useRouter();
  const { token, isAuthloading } = useAuthStore();
    const [showServerMsg, setShowServerMsg] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowServerMsg(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthloading) return ;

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, isAuthloading]);

    return (
   <>
    {!showServerMsg ? (
      <Spinner
        fullscreen
        text="Loading…"
      />
    ) : (
      <Spinner
        fullscreen
        text="Please wait, the server is starting. This may take a few seconds."
      />
    )}
  </>
  );
}