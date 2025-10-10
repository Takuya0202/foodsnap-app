"use client";
import Accessibility from "@/app/components/elements/others/accessibility";
import { useDashboard } from "@/app/zustand/dashboard";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { isLoading ,
    setData ,
    setLoading ,
    likeCount,
    commentCount } = useDashboard();
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
          )
        }
        else {
          const data = await res.json();
          open(data.error, "error");
          router.push("/admin/login");
        }
      } catch  {
        open("通信エラーが発生しました。もう一度お試しください。", "error");
      }
      finally {
        setLoading(false);
      }
    }
    fetchData();
  } , [setData, setLoading, open, router]);

  if (isLoading) {
    <>
    <header className="w-full h-[100px] flex items-center justify-between bg-[#181818] px-10">
      <div>
        <Link href={"/admin/dashboard"} className="text-white text-[24px] font-bold">
          FoodSnap
        </Link>
      </div>
    </header>
    <main className="flex-1">
      <div className="flex flex-col h-full w-full px-20">
        <div className="flex items-center space-x-8">
          <Accessibility loading={true} />
          <Accessibility loading={true} />
        </div>
      </div>
    </main>
  </>
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
