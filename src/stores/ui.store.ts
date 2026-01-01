
import { create } from "zustand";

export type ActiveModal =
  | null
  | "createGroup"
  | "groupInfo"
  | "userProfile"
  | "profile"
  | "addMember"
  | "updateProfile";

interface UIState {
  activeModal: ActiveModal;

  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;

  isOpen: (modal: ActiveModal) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeModal: null,

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),

  isOpen: (modal) => get().activeModal === modal,
}));
