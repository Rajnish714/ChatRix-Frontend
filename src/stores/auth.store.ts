import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthloading: boolean;
  otpSession:string|null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setAuthLoading: (v: boolean) => void;
  setOTPSession: (otpSession: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthloading: true,
      otpSession:null,

      login: (token, user) =>
        set({ token, user }),

      logout: () =>
        set({ token: null, user: null, isAuthloading: false }),

      setToken: (token) =>
        set({ token }),

      setUser: (user) =>
        set({ user }),

      setAuthLoading: (isAuthloading) =>
        set({ isAuthloading }),

       setOTPSession:(otpSession)=>
        set({otpSession}),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token, 
      }),
    }
  )
);