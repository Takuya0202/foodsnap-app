"use client";
import Accessibility from "@/app/components/elements/others/accessibility";
import { useDashboard } from "@/app/hooks/useDashboard";

export default function AdminDashboard() {
  // 管理者データの取得
  const { data, isError, error } = useDashboard();
  return (
    <div className="flex flex-col h-full w-full px-20">
      {/* いいね、コメント数のコンポーネント */}
      <div className="flex items-center space-x-8">
        <Accessibility count={data.likeCount} label="like" loading={false} />
        <Accessibility count={data.commentCount} label="comment" loading={false} />
      </div>
    </div>
  );
}
