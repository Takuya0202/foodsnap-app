"use client";

import { useDashboard } from "@/app/zustand/dashboard";
import Link from "next/link";

export default function PcAdminHeader() {
  const { name } = useDashboard();
  return (
    <header className="w-full h-[100px] flex items-center justify-between">
      {/* ロゴ */}
      <div>
        <Link href={"/admin/dashboard"} className="text-white text-[24px] font-bold">
          FoodSnap
        </Link>
      </div>

      <div>
        <p className="text-white text-[16px] font-bold">{name}</p>
      </div>
    </header>
  );
}
