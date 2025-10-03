"use client";
import { useUser } from "@/app/zustand/user";
import Image from "next/image";

export default function UserIcon() {
  const { icon } = useUser();
  return (
    <Image
      src={icon || "/default-icon.svg"}
      alt="ユーザーアイコン"
      width={64}
      height={64}
      className="rounded-full"
    />
  );
}
