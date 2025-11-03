import { ChevronRight } from "@mui/icons-material";
import ProfileDisplay from "../../features/user/profile-display";
import Link from "next/link";
import StoreModal from "@/app/components/layouts/modal/storeModal";
import { serverClient } from "@/utils/serverClient";
import StoreIndex, { StoreIndexItemSkeleton } from "@/app/components/elements/stores/storeIndex";
import { Suspense } from "react";

async function fetchData() {
  try {
    const client = await serverClient();
    const res = await client.api.user.detail.$get();
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      const data = await res.json();
      throw new Error(data.error);
    }
  } catch (error) {
    throw error;
  }
}
function UserSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-6 px-6 py-4">
      <ProfileDisplay />
      <div className="w-full flex justify-end">
        <Link
          href="/user/edit"
          className="text-white font-bold bg-[#181818] rounded-[6px] cursor-pointer px-4 py-2"
        >
          プロフィールを編集
        </Link>
      </div>

      {/* いいねしてる投稿一覧 */}
      <div className="w-full flex items-center space-x-2 border-b border-white pb-2 pl-2">
        <ChevronRight sx={{ color: "white", width: 24, height: 24 }} />
        <span className="text-white ">いいねした投稿</span>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <StoreIndexItemSkeleton />
        <StoreIndexItemSkeleton />
        <StoreIndexItemSkeleton />
        <StoreIndexItemSkeleton />
      </div>
    </div>
  );
}
async function UserContent() {
  const data = await fetchData();
  return (
    <div className="flex flex-col items-center space-y-6 px-6 py-4">
      <ProfileDisplay />
      <div className="w-full flex justify-end">
        <Link
          href="/user/edit"
          className="text-white font-bold bg-[#181818] rounded-[6px] cursor-pointer px-4 py-2"
        >
          プロフィールを編集
        </Link>
      </div>

      {/* いいねしてる投稿一覧 */}
      <div className="w-full flex items-center space-x-2 border-b border-white pb-2 pl-2">
        <ChevronRight sx={{ color: "white", width: 24, height: 24 }} />
        <span className="text-white ">いいねした投稿</span>
      </div>

      <div>
        <StoreIndex stores={data.likeStores} />
      </div>

      {/* モーダル */}
      <StoreModal />
    </div>
  );
}

export default function UserPage() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserContent />
    </Suspense>
  );
}
