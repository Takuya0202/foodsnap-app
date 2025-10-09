import { client } from "@/utils/setting";
import { useSuspenseQuery } from "@tanstack/react-query";

// サーバーステートでダッシュボードを管理
export const useDashboard = () => {
  return useSuspenseQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await client.api.admin.dashboard.$get();
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 401) {
        throw new Error("管理者権限がありません。");
      } else {
        throw new Error("情報の取得に失敗しました。もう一度お試しください。");
      }
    },
  });
};
