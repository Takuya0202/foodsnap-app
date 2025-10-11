"use client";
import Accessibility from "@/app/components/elements/others/accessibility";
import { useDashboard } from "@/app/zustand/dashboard";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { isLoading, setData, setLoading, likeCount, commentCount } = useDashboard();
  const { open } = useToaster();
  const router = useRouter();

  // データの取得
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await client.api.admin.dashboard.$get();
        if (res.status === 200) {
          const data = await res.json();
          setData(
            data.id,
            data.name,
            data.likeCount,
            data.commentCount,
            data.posts || [],
            data.comments || []
          );
        } else {
          const data = await res.json();
          open(data.error, "error");
          router.push("/auth/admin/login");
        }
      } catch {
        open("通信エラーが発生しました。もう一度お試しください。", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [setData, setLoading, open, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full px-20">
        <div className="flex items-center space-x-8">
          <Accessibility loading={true} />
          <Accessibility loading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full px-20">
      {/* いいね、コメント数のコンポーネント */}
      <div className="flex items-center space-x-8">
        <Accessibility count={likeCount} label="like" loading={false} />
        <Accessibility count={commentCount} label="comment" loading={false} />
      </div>
    </div>
  );
}
