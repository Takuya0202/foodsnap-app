import { getApiUrl } from "@/utils/setting";
import GoogleIcon from "@mui/icons-material/Google";
export default function GoogleLogin() {
  return (
    <button
      className="flex items-center justify-between cursor-pointer bg-white text-black rounded-[8px] space-x-4 py-2 px-4"
      onClick={() => {
        window.location.href = `${getApiUrl()}/api/auth/google`;
      }}
    >
      <GoogleIcon />
      <span>Googleでログイン</span>
    </button>
  );
}
