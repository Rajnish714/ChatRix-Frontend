import { create } from "zustand";

type AlertType = "success" | "error" | "info";

type AlertState = {
  message: string | null;
  type: AlertType;
  show: (msg: string, type?: AlertType) => void;
  clear: () => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  message: null,
  type: "info",
  show: (message, type = "info") => set({ message, type }),
  clear: () => set({ message: null }),
}));