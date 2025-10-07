import AdminRegisterForm from "@/app/features/auth/admin-register-form";

export default function AdminRegister() {
  return (
    <div className="w-full flex justify-center items-center">
      <div
        className="w-[80%] max-w-[640px] p-6 bg-[#181818] rounded-[10px] shadow-[6px_4px_4px_rgba(0,0,0,0.25)] 
      flex flex-col items-center space-y-4 my-10"
      >
        <h1 className="my-8 text-white text-[32px]">新規店舗登録</h1>
        <AdminRegisterForm />
      </div>
    </div>
  );
}
