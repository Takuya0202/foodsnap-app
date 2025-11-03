"use client";
import SpUser from "../components/layouts/footer/sp-user-footer";
import SpUserHeader from "../components/layouts/header/sp-user-header";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0">
        <SpUserHeader />
      </div>
      <div className="flex-1">{children}</div>
      <SpUser />
    </div>
  );
}
