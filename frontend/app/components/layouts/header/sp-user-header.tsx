import Keyword from "@/app/features/store/keyword";
import HamburgerButton from "../../elements/buttons/hamburger-button";
// スマホサイズでのユーザー画面のヘッダー
export default function SpUserHeader() {
  return (
    <>
      <div className="w-full py-4 px-5 flex justify-between items-center bg-[#181818]">
        <div className="flex-[0.9]">
          <Keyword />
        </div>
        <HamburgerButton />
      </div>
    </>
  );
}
