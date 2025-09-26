export type userDetailResponse = {
  id: string;
  name: string;
  icon: string | null;
  likeStores: Array<{
    id: string;
    name: string;
    address: string;
    photo: string | null;
    posts: Array<{
      id: string;
      name: string;
      price: number;
      photo: string;
      description: string | null;
    }>;
    likeCount: number;
    commentCount: number;
  }>;
};
