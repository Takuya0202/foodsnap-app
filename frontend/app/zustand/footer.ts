import { create } from "zustand";

// footerの選択されているボタンを管理するstate
type FooterState = {
  top: boolean;
  index: boolean;
  user: boolean;
  setButton: (button: "top" | "index" | "user") => void;
};

export const useFooter = create<FooterState>((set) => ({
  top: false,
  index: false,
  user: false,
  setButton: (button) => set({ top: false, index: false, user: false, [button]: true }),
}));
