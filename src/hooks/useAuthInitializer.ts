"use client";

import { useEffect, useState } from "react";
import { useAuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useAuthInitializer = () => {
  const { token, setUser } = useAuthStore();
  const [isError, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      try {
        const user = await useAuthService.getMe();
        setUser(user);
      } catch (error) {
        setError(getErrorMessage(error));
        console.log("auth/me failed, waiting for interceptor refresh...");
        // ❌ DO NOT CALL logout()
      }
    };

    init();
  }, [token]);
};
