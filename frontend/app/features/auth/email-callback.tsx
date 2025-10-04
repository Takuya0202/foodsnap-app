import { CircularProgress } from "@mui/material";
import Check from "../../components/elements/icons/check";

export default function EmailCallback() {
  return (
    <div
      className="w-[312px] h-auto min-h-[380px] rounded-[10px] bg-[#181818] py-6 px-4
      shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div className="flex flex-col justify-between items-center w-[96%] mx-auto min-h-[380px]">
        <Check />

        <p className="text-white text-center text-[20px] font-bold">
          ユーザー登録中です。
          <br />
          しばらくお待ちください。
        </p>

        <CircularProgress
          size={40}
          sx={{
            color: "#3b82f6",
            marginBottom: "20px",
          }}
        />
      </div>
    </div>
  );
}
