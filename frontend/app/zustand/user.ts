import { create } from "zustand";

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

export const useUser = create<UserState>((set) => ({
  id: "",
  name: "",
  icon: "",
  likeStores: [],
  setUser: (id, name, icon, likeStores) => set({ id, name, icon, likeStores }),
}));
