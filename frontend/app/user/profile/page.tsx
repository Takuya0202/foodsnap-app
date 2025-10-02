"use client";

import { client } from "@/utils/setting";
import { useEffect } from "react";
import UserProfile from "../../components/molecules/user-profile";
import DeleteUser from "@/app/components/organisms/deleteUser";
import SpUserFooter from "@/app/components/molecules/footer/sp-user-footer";
import { useUser } from "@/app/zustand/user";
import SpUserHeader from "@/app/components/molecules/header/sp-user-header";
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
      <SpUserHeader />
      <div className="flex justify-center items-center">
        <UserProfile />
      </div>
      <DeleteUser />
      <SpUserFooter />
    </div>
  );
}
