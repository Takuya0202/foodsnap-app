import LinkButton from "@/app/components/elements/buttons/link-button";
import { ErrorOutline, Home, Search } from "@mui/icons-material";

export default function NotFound() {
  return (
    <div className="w-full h-screen max-w-[480px] mx-auto flex flex-col items-center justify-center p-8 space-y-8">
      <div className="relative">
        {/* 背景 */}
        <div className="absolute inset-0 bg-[#3d91ff] opacity-20 blur-3xl rounded-full animate-pulse"></div>
        <ErrorOutline
          sx={{
            color: "#3d91ff",
            width: 120,
            height: 120,
          }}
        />
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-[80px] font-bold text-white tracking-wider leading-none">404</h1>
        {/* ボーダー */}
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#3d91ff] to-transparent"></div>
      </div>

      <div className="text-center space-y-3">
        <p className="text-white text-xl font-semibold">ページが見つかりませんでした</p>
        <p className="text-[#ccc] text-sm">
          お探しのページは存在しないか、
          <br />
          URLが間違っている可能性があります
        </p>
      </div>

      <div className="flex flex-col space-y-3 w-full max-w-[320px]">
        <LinkButton
          href="/stores/top"
          className="w-full bg-[#3d91ff] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
          icon={<Home sx={{ width: 20, height: 20 }} />}
        >
          トップページへ
        </LinkButton>

        <LinkButton
          href="/stores/index"
          className="w-full bg-[#202020] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
          icon={<Search sx={{ width: 20, height: 20 }} />}
        >
          店舗を探す
        </LinkButton>
      </div>
    </div>
  );
}
