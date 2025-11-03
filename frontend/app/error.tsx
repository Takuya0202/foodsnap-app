"use client";

import LinkButton from "@/app/components/elements/buttons/link-button";
import { ErrorOutline, Home, Refresh } from "@mui/icons-material";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="w-full h-screen max-w-[480px] mx-auto flex flex-col items-center justify-center p-8 space-y-8">
      <div className="relative">
        {/* 背景 */}
        <div className="absolute inset-0 bg-[#6b7280] opacity-15 blur-3xl rounded-full"></div>
        <ErrorOutline
          sx={{
            color: "#6b7280",
            width: 100,
            height: 100,
          }}
        />
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-[32px] font-medium text-white tracking-wide">問題が発生しました</h1>
        {/* ボーダー */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#6b7280] to-transparent opacity-50"></div>
      </div>

      <div className="text-center space-y-3">
        <p className="text-[#e5e7eb] text-base">申し訳ございません</p>
        <p className="text-[#9ca3af] text-sm leading-relaxed max-w-[280px]">
          {error.message || "一時的な問題が発生しました。\n再度お試しください。"}
        </p>
      </div>

      <div className="flex flex-col space-y-3 w-full max-w-[320px]">
        <button
          onClick={reset}
          className="w-full bg-[#4b5563] hover:bg-[#6b7280] transition-colors text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-md"
        >
          <Refresh sx={{ width: 20, height: 20 }} />
          <span>再読み込み</span>
        </button>

        <LinkButton
          href="/stores/top"
          className="w-full bg-[#202020] hover:bg-[#303030] transition-colors text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-md border border-[#404040]"
          icon={<Home sx={{ width: 20, height: 20 }} />}
        >
          トップページへ
        </LinkButton>
      </div>
    </div>
  );
}
