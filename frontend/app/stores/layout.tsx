"use client";
import SpUser from "../components/layouts/footer/sp-user-footer";
import SpUserHeader from "../components/layouts/header/sp-user-header";

export default function StoresLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <SpUserHeader />

      <main className="flex-1 overflow-hidden">{children}</main>
      <div className="flex-shrink-0">
        <SpUser />
      </div>
    </div>
  );
}
