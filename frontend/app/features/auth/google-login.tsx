"use client";
import { getApiUrl } from "@/utils/setting";
import GoogleIcon from "@mui/icons-material/Google";

type props = {
  width?: string;
  height?: string;
  className?: string;
};

export default function GoogleLogin({ width = "240px", height = "32px", className = "" }: props) {
  return (
    <button
      className={`flex items-center justify-center cursor-pointer bg-[#e3e3e3] text-black
      rounded-[6px] space-x-4 ${className}`}
      style={{ width, height }}
      onClick={() => {
        window.location.href = `${getApiUrl()}/api/auth/google`;
      }}
    >
      <GoogleIcon sx={{ color: "#4285F4" }} />
      <span>Googleでログイン</span>
    </button>
  );
}
