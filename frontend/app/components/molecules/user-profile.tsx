"use client";
import { useUser } from "@/app/zustand/user";
import UserIcon from "../atoms/icons/user-icon";
export default function UserProfile() {
  const { name } = useUser();
  return (
    <div className="flex items-center justify-around px-6 py-4 w-[80%] mx-auto">
      <UserIcon />
      <p className="text-white text-[24px] ">{name}</p>
    </div>
  );
}
