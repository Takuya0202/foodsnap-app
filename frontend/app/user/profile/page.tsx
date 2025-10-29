import ProfileDisplay from "../../features/user/profile-display";
import Link from "next/link";
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
    </div>
  );
}
