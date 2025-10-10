import { create } from "zustand";
// 管理者ダッシュボードのステート
type DashboardState = {
  isLoading: boolean;
  id: string;
  name: string;
  likeCount: number;
  commentCount: number;
  posts:
    | {
        id: string;
        name: string;
        price: number;
        photo: string;
        description: string | null;
        updatedAt: string;
      }[]
    | null;
  comments:
    | {
        id: string;
        userName: string;
        userIcon: string | null;
        content: string;
        createdAt: string;
      }[]
    | null;
  setLoading: (isLoading: boolean) => void;
  setData: (
    id: string,
    name: string,
    likeCount: number,
    commentCount: number,
    posts: {
      id: string;
      name: string;
      price: number;
      photo: string;
      description: string | null;
      updatedAt: string;
    }[],
    comments: {
      id: string;
      content: string;
      userName: string;
      userIcon: string | null;
      createdAt: string;
    }[]
  ) => void;
};

export const useDashboard = create<DashboardState>((set) => ({
  isLoading: false,
  id: "",
  name: "",
  likeCount: 0,
  commentCount: 0,
  posts: null,
  comments: null,
  setLoading: (isLoading) => set({ isLoading }),
  setData: (id, name, likeCount, commentCount, posts, comments) =>
    set({
      id,
      name,
      likeCount,
      commentCount,
      posts,
      comments,
    }),
}));
