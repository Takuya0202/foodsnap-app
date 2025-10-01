import { create } from "zustand";

// トースターの状態管理
type ToasterState = {
  status: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
  open: (message: string, type: "success" | "error" | "warning" | "info") => void;
  close: () => void;
};

export const useToaster = create<ToasterState>((set) => ({
  status: false,
  message: "",
  type: "info",
  open: (message, type) => set({ status: true, message, type }),
  close: () => set({ status: false, message: "" }),
}));
