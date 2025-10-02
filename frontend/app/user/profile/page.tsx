"use client";

import { client } from "@/utils/setting";
import { useEffect, useState } from "react";
import UserProfile from "../../components/molecules/user-profile";
import DeleteUser from "@/app/components/organisms/deleteUser";
import SpUserFooter from "@/app/components/molecules/footer/sp-user-footer";

export default function UserPage() {
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  useEffect(() => {
    async function getUserDetail() {
      const res = await client.api.user.detail.$get();
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setIcon(data.icon || "");
      }
    }
    getUserDetail();
  }, []);

  return (
    <div>
      <h1>UserPage</h1>
      <UserProfile name={name} icon={icon} />
      <DeleteUser />
      <SpUserFooter />
    </div>
  );
}
