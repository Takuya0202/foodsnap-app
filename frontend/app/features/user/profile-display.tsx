"use client";
import { useUser } from "@/app/zustand/user";
import UserIcon from "../../components/elements/icons/user-icon";
import Link from "next/link";

export default function ProfileDisplay() {
  const { name } = useUser();
  return (
    <div className="flex flex-col items-center space-y-6 px-6 py-4">
      <div className="flex items-center space-x-10">
        <UserIcon />
        <p className="text-white text-[24px]">{name}</p>
      </div>

      <button className="text-white font-bold bg-[#181818] rounded-[6px] cursor-pointer px-4 py-2 ml-40">
        <Link href="/user/edit">プロフィールを編集</Link>
      </button>
    </div>
  );
}
