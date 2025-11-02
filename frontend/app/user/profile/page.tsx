import { ChevronRight } from "@mui/icons-material";
import ProfileDisplay from "../../features/user/profile-display";
import Link from "next/link";
import StoreModal from "@/app/components/layouts/modal/storeModal";
import StoreLikes from "@/app/components/elements/stores/storelikes";
export default function UserPage() {
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
        <StoreLikes />
      </div>

      {/* モーダル */}
      <StoreModal />
    </div>
  );
}
