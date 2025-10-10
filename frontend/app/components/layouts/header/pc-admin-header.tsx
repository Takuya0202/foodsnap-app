"use client";

import UserLogout from "@/app/features/auth/logout";
import { useDashboard } from "@/app/zustand/dashboard";
import { Settings } from "@mui/icons-material";
import Link from "next/link";

export default function PcAdminHeader() {
  const { name } = useDashboard();
  return (
    <header className="w-full h-[100px] flex items-center justify-between bg-[#181818] px-10">
      {/* ロゴ */}
      <div>
        <Link href={"/admin/dashboard"} className="text-white text-[24px] font-bold">
          FoodSnap
        </Link>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <p className="text-white text-[16px] font-bold">{name}</p>
        <button className="bg-[#908b8b] flex items-center px-4 py-1.5 space-x-2 h-[44px] whitespace-nowrap">
          <Settings sx={{ color: "#fff", width: "24px", height: "24px" }} />
          <p className="text-white font-bold">管理者情報の編集</p>
        </button>
        <UserLogout path="admin" />
      </div>
    </header>
  );
}
