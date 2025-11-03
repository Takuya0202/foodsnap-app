"use client";
import { useToaster } from "@/app/zustand/toaster";
import { useUser } from "@/app/zustand/user";
import { client } from "@/utils/setting";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logout } from "@mui/icons-material";

type props = {
  path?: "user" | "admin";
};

export default function UserLogout({ path = "user" }: props) {
  const router = useRouter();
  const { open } = useToaster();
  const { clearUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleLogout = async () => {
    setIsSubmitting(true);
    const res = await client.api.auth.logout.$post();
    if (res.status === 200) {
      clearUser(); // Zustandをクリア
      open("ログアウトしました。", "success");
      router.push(`/auth/${path}/login`);
    } else {
      open("ログアウトに失敗しました。", "error");
    }
    setIsSubmitting(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isSubmitting}
      className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#262626] transition-colors disabled:opacity-50"
    >
      <Logout sx={{ color: "#ffffff", width: "24px", height: "24px" }} />
      <span className="text-white text-base">
        {isSubmitting ? "ログアウト中..." : "ログアウト"}
      </span>
    </button>
  );
}
