"use client";
import { useUser } from "@/app/zustand/user";
import UserIcon from "../../components/elements/icons/user-icon";

export default function ProfileDisplay() {
  const { name } = useUser();
  return (
    <div className="flex items-center space-x-10">
      <UserIcon />
      <p className="text-white text-[20px] flex-1">{name}</p>
    </div>
  );
}
