import { DeleteForever } from "@mui/icons-material";

// ユーザー削除のボタン。実際には削除ではなく、退会ページに遷移する。
type props = {
  setIsOpen: (open: boolean) => void;
};
export default function UserDeleteButton({ setIsOpen }: props) {
  return (
    <button
      className="flex items-center gap-2 p-1.5 rounded-[#6px] hover:outline"
      onClick={() => setIsOpen(true)}
    >
      <DeleteForever sx={{ color: "#ff0000", width: "32px", height: "32px" }} />
      <span className="text-[#ff0000]">アカウント削除</span>
    </button>
  );
}
