import {create} from "zustand"


interface UIState {
  showCreateGroup: boolean;
  openCreateGroup: () => void;
  closeCreateGroup: () => void;
}


export const useUIStore = create<UIState>((set) => ({
  showCreateGroup: false,
  openCreateGroup: () => set({ showCreateGroup: true }),
  closeCreateGroup: () => set({ showCreateGroup: false }),
}));