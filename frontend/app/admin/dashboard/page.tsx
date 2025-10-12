import Accessibility from "@/app/components/elements/others/accessibility";
import {
  PcAdminHeader,
  PcAdminHeaderSkeleton,
} from "@/app/components/layouts/header/pc-admin-header";
import { serverClient } from "@/utils/serverClient";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PostCardContetnt, PostCardSkeleton } from "@/app/components/elements/others/postCard";
import {
  CommentCardContent,
  CommentCardSkeleton,
} from "@/app/components/elements/others/CommentCard";
import Link from "next/link";
// スケルトンUI。promiseの間(fetchが完了するまで)に表示するUI
function DashboardSkeleton() {
  return (
    <>
      {/* ヘッダー */}
      <PcAdminHeaderSkeleton />
      {/* mainコンテンツ */}
      <div className="flex flex-col h-full w-full p-20 space-y-10">
        {/* いいね、コメント数のコンポーネント */}
        <div className="flex items-start flex-col space-y-8">
          <h2 className="text-3xl text-white">アクセシビリティ</h2>
          <div className="flex items-center space-x-8">
            <div className="w-[400px] h-[140px] bg-skLoading rounded-2xl flex items-center">
              <div className="w-20 h-20 rounded-full bg-[#545454] flex items-center justify-center mx-6"></div>
              <p className="text-white text-4xl">0</p>
            </div>
            <div className="w-[400px] h-[140px] bg-skLoading rounded-2xl flex items-center">
              <div className="w-20 h-20 rounded-full bg-[#545454] flex items-center justify-center mx-6"></div>
              <p className="text-white text-4xl">0</p>
            </div>
          </div>
        </div>

        {/* 投稿一覧 */}
        <div className="flex items-start flex-col space-y-8">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-3xl text-white">投稿一覧</h2>
            <button className="py-4 px-28 bg-skLoading text-white rounded-sm">新規投稿</button>
          </div>
          <div className="flex items-center space-x-8">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>

        {/* コメント一覧 */}
        <div className="flex items-start flex-col space-y-8">
          <h1 className="text-3xl text-white">コメント</h1>
          <div className="flex items-center space-x-8">
            <CommentCardSkeleton />
            <CommentCardSkeleton />
          </div>
        </div>
      </div>
    </>
  );
}
async function DashboardContent() {
  const fetchData = async () => {
    const client = await serverClient();
    const res = await client.api.admin.dashboard.$get();
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      const data = await res.json();
      console.log(data.error);
      return redirect("/auth/admin/login");
    }
  };
  const data = await fetchData();
  return (
    <>
      <PcAdminHeader name={data.name} />
      <div className="flex flex-col h-full w-full p-20 space-y-10">
        {/* いいね、コメント数のコンポーネント */}
        <div className="flex items-start flex-col space-y-8">
          <h2 className="text-3xl text-white">アクセシビリティ</h2>
          <div className="flex items-center space-x-8">
            <Accessibility count={data.likeCount} label="like" />
            <Accessibility count={data.commentCount} label="comment" />
          </div>
        </div>

        {/* 投稿一覧 */}
        <div className="flex items-start flex-col space-y-8">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-3xl text-white">投稿一覧</h2>
            <Link
              className="py-4 px-28 bg-[#898989] text-white rounded-sm"
              href="/admin/post/create"
            >
              新規投稿
            </Link>
          </div>
          <div className="flex items-center space-x-8 w-full overflow-x-scroll">
            {data.posts?.map((post) => (
              <div key={post.id}>
                <PostCardContetnt
                  id={post.id}
                  name={post.name}
                  price={post.price}
                  photo={post.photo}
                />
              </div>
            ))}
          </div>
        </div>

        {/* コメント一覧 */}
        <div className="flex items-start flex-col space-y-8">
          <h1 className="text-3xl text-white">コメント</h1>
          <div className="flex items-center space-x-8 w-full overflow-x-scroll">
            {data.comments?.map((comment) => (
              <div key={comment.id}>
                <CommentCardContent
                  userName={comment.userName}
                  userIcon={comment.userIcon || ""}
                  content={comment.content}
                  createdAt={comment.createdAt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
