import HamburgerButton from "../../elements/buttons/hamburger-button";
// スマホサイズでのユーザー画面のヘッダー
export default function SpUserHeader() {
  return (
    <>
      <div className="w-full py-4 px-5 flex justify-between items-center bg-[#181818]">
        {/* キーワード入力 */}
        <div>
          <input
            type="text"
            className="w-[256px] h-[32px] bg-[#3d3d3d] py-2 pl-8
      placeholder:text-white placeholder:text-[12px] text-white text-[12px]"
            placeholder="キーワードを入力"
          />
        </div>
        <HamburgerButton />
      </div>
    </>
  );
}
