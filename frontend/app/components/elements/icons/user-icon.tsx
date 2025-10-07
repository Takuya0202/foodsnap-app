"use client";
import { useUser } from "@/app/zustand/user";
import Image from "next/image";

export default function UserIcon() {
  const { icon } = useUser();
  return (
    <div className="w-16 h-16 rounded-full overflow-hidden">
      <Image
        src={icon || "/default-icon.svg"}
        alt="ユーザーアイコン"
        width={64}
        height={64}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
