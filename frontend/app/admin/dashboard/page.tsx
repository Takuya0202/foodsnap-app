"use client";
import Accessibility from "@/app/components/elements/others/accessibility";
import { useDashboard } from "@/app/hooks/useDashboard";
import { Suspense } from "react";

export default function AdminDashboard() {
  // 管理者データの取得
  const { data, isLoading, isError, error } = useDashboard();
  return (
    <div className="flex flex-col h-full w-full px-20">
      <h1>Admin Dashboard</h1>

      {/* いいね、コメント数のコンポーネント */}
      <div className="flex items-center space-x-8">
        <Suspense fallback={<Accessibility loading={true} /> }>
          <Accessibility count={data.likeCount} label="like" loading={false}/>
        </Suspense>
        <Suspense fallback={<Accessibility loading={true} /> }>
          <Accessibility count={data.commentCount} label="comment" loading={false}/>
        </Suspense>
      </div>
    </div>
  );
}
