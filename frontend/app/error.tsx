"use client";

import LinkButton from "@/app/components/elements/buttons/link-button";
import { ReportProblem, Home, Refresh } from "@mui/icons-material";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="w-full h-screen max-w-[480px] mx-auto flex flex-col items-center justify-center p-8 space-y-8">
      <div className="relative">
        {/* 背景 */}
        <div className="absolute inset-0 bg-[#ff3d3d] opacity-20 blur-3xl rounded-full animate-pulse"></div>
        <ReportProblem
          sx={{
            color: "#ff3d3d",
            width: 120,
            height: 120,
          }}
        />
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-[48px] font-bold text-white tracking-wider leading-none">ERROR</h1>
        {/* ボーダー */}
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff3d3d] to-transparent"></div>
      </div>

      <div className="text-center space-y-3">
        <p className="text-white text-xl font-semibold">エラーが発生しました</p>
        <p className="text-[#ccc] text-sm">{error.message || "予期しないエラーが発生しました"}</p>
      </div>

      <div className="flex flex-col space-y-3 w-full max-w-[320px]">
        <button
          onClick={reset}
          className="w-full bg-[#ff3d3d] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
        >
          <Refresh sx={{ width: 20, height: 20 }} />
          <span>再読み込み</span>
        </button>

        <LinkButton
          href="/stores/top"
          className="w-full bg-[#202020] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
          icon={<Home sx={{ width: 20, height: 20 }} />}
        >
          トップページへ
        </LinkButton>
      </div>
    </div>
  );
}
