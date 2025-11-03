import { create } from "zustand";
import { commentResponse } from "@/types/store";

// モーダルでのコメントに関するステート
type CommentStore = {
  isOpen: boolean;
  isLoading: boolean;
  comments: commentResponse;
  currentStoreId: string | null;
  openComment: (storeId: string) => void;
  closeComment: () => void;
  setComments: (comments: commentResponse) => void;
  setLoading: (loading: boolean) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  isOpen: false,
  isLoading: false,
  comments: null,
  currentStoreId: null,
  openComment: (storeId) => set({ isOpen: true, currentStoreId: storeId }),
  closeComment: () => set({ isOpen: false, currentStoreId: null }),
  setComments: (comments) => set({ comments }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
