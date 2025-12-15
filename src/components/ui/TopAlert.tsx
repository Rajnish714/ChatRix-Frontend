"use client";

import { useEffect } from "react";
import { useAlertStore } from "@/stores/alert.store";

export function TopAlert() {
  const { message, type, clear } = useAlertStore();

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(clear, 2000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div className={`top-alert ${type}`}>
      <div className="top-alert__content">{message}</div>
    </div>
  );
}