import ResetPassword from "@/app/features/auth/reset-password";

export default function AdminResetPassword() {
  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div
        className="w-[80%] max-w-[480px] bg-[#1a1a1a] p-4 rounded-lg shadow-form
      flex flex-col items-center space-y-4"
      >
        <h1 className="text-2xl font-bold text-white">パスワードリセット</h1>
        <ResetPassword />
      </div>
    </div>
  );
}
