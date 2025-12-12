import {create} from "zustand"
import { User } from "@/types/auth.types"
import { persist } from "zustand/middleware";

interface AuthSate{
    user:User | null;
    token:string|null;
    isAuthenticated:boolean;
    login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser :(user: User | null) => void;
}

export const useAuthStore= create<AuthSate>()(persist((set)=>({
    user:null,
    token:null,
   isAuthenticated:false,

    login:(token, user) => set({ token, user,isAuthenticated: true }),

    logout: () => set({ token: null, user: null,isAuthenticated:false }),

    setToken: (token) => set({ token }),

    setUser:(user)=>set({user})
       
}),
{
      name: "auth-storage", 
   
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),

    }
))