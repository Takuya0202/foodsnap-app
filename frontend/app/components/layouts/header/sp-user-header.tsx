import { Menu } from "@mui/icons-material";
// スマホサイズでのユーザー画面のヘッダー
export default function SpUserHeader() {
  return (
    <>
      <div
        className="w-full py-4 px-5 flex justify-between items-center bg-[#181818]
        fixed top-0 z-50"
      >
        {/* キーワード入力 */}
        <div>
          <input
            type="text"
            className="w-[256px] h-[32px] bg-[#3d3d3d] py-2 pl-8
      placeholder:text-white placeholder:text-[12px] text-white text-[12px]"
            placeholder="キーワードを入力"
          />
        </div>

        <button className="w-[48px] h-[32px] flex justify-center items-center bg-[#3d3d3d]">
          <Menu
            sx={{
              color: "#fff",
            }}
          />
        </button>
      </div>

      <div className="w-full h-[64px]"></div>
    </>
  );
}
