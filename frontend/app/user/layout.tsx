"use client";
import SpUser from "../components/layouts/footer/sp-user-footer";
import SpUserHeader from "../components/layouts/header/sp-user-header";
import { useAuth } from "../hooks/useAuth";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <SpUserHeader />
      {children}
      <SpUser />
    </div>
  );
}
