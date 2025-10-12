"use client";
import UserLogout from "@/app/features/auth/logout";
import { Settings } from "@mui/icons-material";
import Link from "next/link";
type props = {
  name: string;
};

export function PcAdminHeaderSkeleton() {
  return (
    <header className="w-full h-[100px] flex items-center justify-between bg-[#181818] px-10">
      <div>
        <Link href={"/admin/dashboard"} className="text-white text-[24px] font-bold">
          FoodSnap
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <button className="bg-[#908b8b] flex items-center px-4 py-1.5 space-x-2 h-[44px] whitespace-nowrap">
          <Settings sx={{ color: "#fff", width: "24px", height: "24px" }} />
          <p className="text-white font-bold">管理者情報の編集</p>
        </button>
        <UserLogout path="admin" />
      </div>
    </header>
  );
}
export function PcAdminHeader({ name }: props) {
  return (
    <header className="w-full h-[100px] flex items-center justify-between bg-[#181818] px-10">
      {/* ロゴ */}
      <div>
        <Link href={"/admin/dashboard"} className="text-white text-[24px] font-bold">
          FoodSnap
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <p className="text-white text-[16px] font-bold whitespace-nowrap">{name}</p>
        <button className="bg-[#908b8b] flex items-center px-4 py-1.5 space-x-2 h-[44px] whitespace-nowrap">
          <Settings sx={{ color: "#fff", width: "24px", height: "24px" }} />
          <p className="text-white font-bold">管理者情報の編集</p>
        </button>
        <UserLogout path="admin" />
      </div>
    </header>
  );
}
