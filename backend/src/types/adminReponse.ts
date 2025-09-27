import z from "zod";
import { updateAdminSchema } from "../schema/admin";

// ログイン時のダッシュボードに表示するデータ
export type AdminReponse = {
  id: string;
  name: string;
  likeCount: number;
  commentCount: number;
  posts: Array<{
    id: string;
    name: string;
    price: number;
    photo: string;
    description: string | null;
    updatedAt: string;
  }> | null;
  comments: Array<{
    id: string;
    content: string;
    userId: string;
    userName: string;
    userIcon: string | null;
    createdAt: string;
  }> | null;
};
// 管理者の情報を取得する時に返却するデータ
export type AdminDetailReponse = z.infer<typeof updateAdminSchema>;