import { storeResponse } from './storeResponse';

export type userDetailResponse = {
  id: string;
  name: string;
  icon: string | null;
  likeStores: storeResponse;
};
