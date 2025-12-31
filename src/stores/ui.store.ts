import {create} from "zustand"


interface UIState {
  showCreateGroup: boolean;
  openCreateGroup: () => void;
  closeCreateGroup: () => void;

    showGroupInfo: boolean;
  openGroupInfo: () => void;
  closeGroupInfo: () => void;

    showUserProfile: boolean;
  openUserProfile: () => void;
  closeUserProfile: () => void;

      showProfile: boolean;
  openProfile: () => void;
  closeProfile: () => void;

   showAddMember: boolean;
  openAddMember: () => void;
  closeAddMember: () => void;
 
}


export const useUIStore = create<UIState>((set) => ({
  showCreateGroup: false,
  openCreateGroup: () => set({ showCreateGroup: true }),
  closeCreateGroup: () => set({ showCreateGroup: false }),


    showGroupInfo: false,
  openGroupInfo: () => set({ showGroupInfo: true }),
  closeGroupInfo: () => set({ showGroupInfo: false }),

     showUserProfile: false,
  openUserProfile: () => set({ showUserProfile: true }),
  closeUserProfile: () => set({ showUserProfile: false }),
    
  showProfile: false,
  openProfile: () => set({ showProfile: true }),
  closeProfile: () => set({ showProfile: false }),
  
  showAddMember: false,
openAddMember: () => set({ showAddMember: true }),
closeAddMember: () => set({ showAddMember: false }),
}));