import Link from "next/link";

export default function UserEditButton() {
  return (
    <button className="text-white font-bold bg-[#181818] rounded-[6px] cursor-pointer px-4 py-2">
      <Link href="/user/edit">プロフィールを編集</Link>
    </button>
  );
}
