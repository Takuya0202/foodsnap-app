import { create } from "zustand";
import { persist } from "zustand/middleware";

// ユーザー情報を管理するstate
type UserState = {
  id: string;
  name: string;
  icon: string;
  likeStores: {
    id: string;
    name: string;
    photo: string | null;
    likeCount: number;
    commentCount: number;
    posts: {
      id: string;
      name: string;
      price: number;
      photo: string;
      description: string | null;
    }[];
  }[];
  setUser: (
    id: string,
    name: string,
    icon: string,
    likeStores: {
      id: string;
      name: string;
      photo: string | null;
      likeCount: number;
      commentCount: number;
      posts: {
        id: string;
        name: string;
        price: number;
        photo: string;
        description: string | null;
      }[];
    }[]
  ) => void;
};

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      id: "",
      name: "",
      icon: "",
      likeStores: [],
      setUser: (id, name, icon, likeStores) => set({ id, name, icon, likeStores }),
    }),
    {
      name: "user",
    }
  )
);
