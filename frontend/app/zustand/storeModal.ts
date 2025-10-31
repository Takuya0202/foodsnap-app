import { create } from "zustand";
import { storeResponse } from "@/types/store";

// 一覧ページやいいねした投稿などで店舗モーダルを表示するためのステート
type StoreModalState = {
  isOpen: boolean;
  currentStoreId: string | null;
  openModal: (storeId: string) => void;
  closeModal: () => void;
  stores: storeResponse;
  setStores: (stores: storeResponse) => void;
};

export const useStoreModal = create<StoreModalState>((set) => ({
  isOpen: false,
  currentStoreId: null,
  openModal: (storeId : string ) => set({ isOpen: true, currentStoreId: storeId }),
  closeModal: () => set({ isOpen: false, currentStoreId: null }),
  stores: [],
  setStores: (stores) => set({ stores }),
}));
