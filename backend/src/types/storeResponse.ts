// 店舗、投稿に関するレスポンスの型
export type storeResponse = {
  id: string;
  name: string;
  address: string;
  likeCount: number;
  commentCount: number;
  photo: string | null;
  latitude: number;
  longitude: number;
  genre: string | null;
  posts: Array<{
    id: string;
    name: string;
    price: number;
    photo: string;
    description: string | null;
  }>;
}[];

export type storeDetailResponse = {
  id: string;
  name: string;
  address: string;
  genre: string | null;
  photo: string | null;
  phone: string;
  latitude: number;
  longitude: number;
  link: string | null;
  startAt: string | null;
  endAt: string | null;
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    userIcon: string | null;
    content: string;
    createdAt: string;
  }> | null;
  posts: Array<{
    id: string;
    name: string;
    price: number;
    photo: string;
    description: string | null;
  }> | null;
  tags: Array<{
    id: string;
    name: string;
  }> | null;
};

export type commentResponse = Array<{
  id: string;
  userId: string;
  userName: string;
  userIcon: string | null;
  content: string;
  createdAt: string;
}> | null;
