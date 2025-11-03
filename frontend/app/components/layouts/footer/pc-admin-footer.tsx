export default function PcAdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full h-[64px] flex items-center justify-between bg-[#181818] px-10 border-t border-gray-700">
      <p className="text-white font-bold text-[20px]">FoodSnap</p>
      <p className="text-gray-400 text-[14px]">© {currentYear} FoodSnap. All rights reserved.</p>
    </footer>
  );
}
