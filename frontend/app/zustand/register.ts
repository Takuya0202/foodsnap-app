import { create } from "zustand";

// ユーザー登録時のメールアドレスを管理
type sendEmailState = {
  email: string;
  setEmail: (email: string) => void;
  isSend: boolean;
  setIsSend: (isSend: boolean) => void;
};

export const useSendEmail = create<sendEmailState>()((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
  isSend: false,
  setIsSend: (isSend) => set({ isSend }),
}));
