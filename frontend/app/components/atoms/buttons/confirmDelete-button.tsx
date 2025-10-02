"use client";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmDeleteButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { open } = useToaster();
  const handleClick = async () => {
    setIsSubmitting(true);
    const res = await client.api.user.delete.$delete();
    if (res.status === 200) {
      open("アカウント削除しました", "success");
      router.push("/user/login");
    } else {
      const data = await res.json();
      open(data.error, "error");
    }
    setIsSubmitting(false);
  };
  return (
    <button
      className="flex items-center gap-2 p-1.5 rounded-[#6px] hover:outline"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      <span className="text-[#ff0000]">アカウント削除</span>
    </button>
  );
}
