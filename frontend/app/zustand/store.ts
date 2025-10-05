import { create } from "zustand";

// 存在するジャンル、エリア、タグを取得
type Stores = {
  genres: {
    id: number;
    name: string;
  }[];
  prefectures: {
    id: number;
    name: string;
    area: string;
  }[];
  tags: {
    id: number;
    name: string;
  }[];
  setGenres: (
    genres: {
      id: number;
      name: string;
    }[]
  ) => void;
  setPrefectures: (
    prefectures: {
      id: number;
      name: string;
      area: string;
    }[]
  ) => void;
  setTags: (
    tags: {
      id: number;
      name: string;
    }[]
  ) => void;
};

export const useStores = create<Stores>((set) => ({
  genres: [],
  prefectures: [],
  tags: [],
  setGenres: (genres) => set({ genres }),
  setPrefectures: (prefectures) => set({ prefectures }),
  setTags: (tags) => set({ tags }),
}));
