import { create } from "zustand";
import { persist } from "zustand/middleware";

// ユーザー情報を管理するstate
type UserState = {
  isAuthenticated: boolean; // 認証済みかどうか
  isChecked: boolean; // 認証チェックするかどうかのフラグ trueの場合、ユーザー情報を再取得する
  id: string;
  name: string;
  icon: string;
  setUser: (id: string, name: string, icon: string) => void;
  setAuthFailed: () => void; // ゲストユーザー。認証失敗時
  setChecked: () => void;
  clearUser: () => void;
};

// persistでローカルストレージ保存
export const useUser = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isChecked: true,
      id: "",
      name: "",
      icon: "",
      setUser: (id, name, icon) =>
        set({
          isAuthenticated: true,
          isChecked: false,
          id,
          name,
          icon,
        }),
      setAuthFailed: () =>
        set({
          isAuthenticated: false,
          isChecked: false,
        }),
      setChecked: () =>
        set({
          isChecked: true, // ユーザー情報再取得にするフラグ
        }),
      clearUser: () =>
        set({
          isAuthenticated: false,
          isChecked: true,
          id: "",
          name: "",
          icon: "",
        }),
    }),
    {
      name: "user",
    }
  )
);
