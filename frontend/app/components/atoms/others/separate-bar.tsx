export default function SeparateBar() {
  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="w-[84px] h-[1px] bg-white"></div>
      <span className="text-white">または</span>
      <div className="w-[84px] h-[1px] bg-white"></div>
    </div>
  );
}
