"use client";

import { useEffect } from "react";
import { useAuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "./useAuth";

export const useAuthInitializer = () => {
  const { setUser, setAuthLoading } = useAuthStore();
  const {logoutUser}= useAuth();


  useEffect(() => {
    const init = async () => {
      try {
               
        const user = await useAuthService.getMeRequest();
        setUser(user);
      } catch (err) {
   console.log(err);
        await logoutUser();
      } finally {
        
        setAuthLoading(false);
      }
    };

    init();
  }, []);
};
