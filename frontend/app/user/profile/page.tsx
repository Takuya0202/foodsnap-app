"use client";

import { client } from "@/utils/setting";
import { useEffect } from "react";
import ProfileDisplay from "../../features/user/profile-display";
import UserDelete from "@/app/features/user/user-delete";
import SpUserFooter from "@/app/components/layouts/footer/sp-user-footer";
import { useUser } from "@/app/zustand/user";
import Link from "next/link";

export default function UserPage() {
  const { setUser } = useUser();
  useEffect(() => {
    async function getUserDetail() {
      const res = await client.api.user.detail.$get();
      if (res.ok) {
        const data = await res.json();
        setUser(data.id, data.name, data.icon || "", data.likeStores);
      }
    }
    getUserDetail();
  }, [setUser]);

  return (
    <div>
      <div className="flex justify-center items-center">
        <ProfileDisplay />
      </div>

      <div className="flex justify-center items-center">
        <button className="text-white font-bold bg-[#181818] rounded-[6px] cursor-pointer px-4 py-2">
          <Link href="/user/edit">プロフィールを編集</Link>
        </button>
      </div>
      <UserDelete />
      <SpUserFooter />
    </div>
  );
}
