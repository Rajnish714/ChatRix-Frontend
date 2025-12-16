"use client";
import { useEffect } from "react";
import { useAlertStore } from "@/stores/alert.store";

export default function TopAlert() {
  const { message, type, clear } = useAlertStore();

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      clear();
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, clear]);

  if (!message) return null;

  const styles = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-[320px]">
      <div
        className={`border-l-4 p-4 rounded-md shadow-md ${styles[type]}`}
        role="alert"
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
