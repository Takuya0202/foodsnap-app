import TopButton from "../../atoms/buttons/top-button";
import IndexButton from "../../atoms/buttons/index-button";
import UserButton from "../../atoms/buttons/user-button";
export default function SpUserFooter() {
  return (
    <footer
      className="flex px-9 py-4 bg-[#181818] justify-between items-center w-full
    fixed bottom-0 z-50"
    >
      <TopButton />
      <IndexButton />
      <UserButton />
    </footer>
  );
}
