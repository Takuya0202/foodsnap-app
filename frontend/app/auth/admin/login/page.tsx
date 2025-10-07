import Address from "@/app/features/mapbox/address";

export default function AdminLogin() {
  return (
    <div className="w-full h-screen">
      <h1>管理者ログイン</h1>
      <div className="flex justify-center items-center w-[80%] h-[400px] m-auto">
        <Address />
      </div>
    </div>
  );
}