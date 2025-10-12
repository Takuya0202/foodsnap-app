import CreateMenu from "@/app/features/post/create-menu";

export default function AdminPostCreate() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div
        className="bg-[#181818] p-6 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.5)]
        flex flex-col items-center w-[80%] max-w-[640px]"
      >
        <h1 className="text-white text-2xl font-bold my-6">新規投稿</h1>
        <CreateMenu />
      </div>
    </div>
  );
}
