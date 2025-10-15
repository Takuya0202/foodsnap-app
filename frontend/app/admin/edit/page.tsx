import EditProfile from "@/app/features/admin/edit-profile";

export default function AdminEdit() {
  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div
        className="w-[80%] max-w-[640px] p-6 bg-[#181818] rounded-[10px] shadow-[6px_4px_4px_rgba(0,0,0,0.25)] 
      flex flex-col items-center space-y-4 my-10"
      >
        <h1 className="my-8 text-white text-[32px]">店舗情報編集</h1>
        <EditProfile />
      </div>
    </div>
  );
}
